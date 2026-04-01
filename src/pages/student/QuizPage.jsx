import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';
import QuizProvider from '../../utils/quizProvider';
import BottomNav from '../../components/BottomNav';

const QuizPage = () => {
  const { chapterId } = useParams();
  const { state } = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  
  const navigate = useNavigate();
  const userId = sessionManager.getUserId();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const { grade: stateGrade, subject: stateSubject, chapterName: stateChapter, formulas } = state || {};
        
        const currentGrade = stateGrade || sessionManager.getGrade() || "8";
        const currentSubject = stateSubject || sessionManager.getSubject() || "Mathematics";
        const currentChapter = stateChapter || sessionManager.getChapterName() || "Quiz";

        console.log(`DEBUG QuizPage: Fetching for Grade=${currentGrade}, Subject=${currentSubject}, Chapter=${currentChapter}`);

        const res = await api.getQuiz(chapterId);
        let apiQuestions = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
        
        // Filter out placeholder questions that start with "Review Question"
        const filteredQuestions = apiQuestions.filter(q => 
          q.question_text && !q.question_text.toLowerCase().startsWith('review question')
        );

        if (filteredQuestions.length === 0) {
          console.log(`DEBUG QuizPage: No real backend questions found, using QuizProvider fallback for ${currentSubject}`);
          const generated = QuizProvider.getQuestions(
            currentGrade,
            currentSubject,
            currentChapter,
            formulas || []
          );
          // Normalize generated questions just in case
          const normalizedGenerated = (generated || []).map(q => ({
            text: String(q.text || ''),
            options: Array.isArray(q.options) ? q.options.map(o => String(o || '')) : [],
            correct: typeof q.correct === 'number' ? q.correct : 0,
            review: String(q.review || q.review_text || '')
          }));
          console.log(`DEBUG QuizPage: Normalized ${normalizedGenerated.length} generated questions:`, JSON.stringify(normalizedGenerated).substring(0, 500));
          setQuestions(normalizedGenerated);
        } else {
          console.log(`DEBUG QuizPage: Using ${filteredQuestions.length} backend questions.`);
          const mappedQuestions = filteredQuestions.map(q => ({
            text: q.text || q.question_text,
            options: Array.isArray(q.options) ? q.options : (typeof q.options === 'string' ? JSON.parse(q.options) : []),
            correct: q.correct_option_index !== undefined ? q.correct_option_index : q.correct,
            review: q.review_text || q.review || ''
          }));
          setQuestions(mappedQuestions);
        }
      } catch (err) {
        console.error('Failed to fetch quiz:', err);
        // Fallback on error
        const { grade: stateGrade, subject: stateSubject, chapterName: stateChapter, formulas } = state || {};
        const currentGrade = stateGrade || sessionManager.getGrade() || "8";
        const currentSubject = stateSubject || sessionManager.getSubject() || "Mathematics";
        const currentChapter = stateChapter || sessionManager.getChapterName() || "Quiz";

        const generated = QuizProvider.getQuestions(
          currentGrade,
          currentSubject,
          currentChapter,
          formulas || []
        );
        setQuestions(generated);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [chapterId, state]);

  // Timer logic - 5 minute countdown
  useEffect(() => {
    if (loading || isQuizFinished || questions.length === 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [loading, isQuizFinished, questions.length]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timeRemaining === 0 && !isQuizFinished && questions.length > 0) {
      handleFinishQuiz();
    }
  }, [timeRemaining]);

  const formattedTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCheck = () => {
    const iCorrect = selectedOption === questions[currentIdx].correct;
    if (iCorrect) setScore(score + 1);
    
    setUserAnswers([...userAnswers, {
      question: questions[currentIdx].text,
      selected: selectedOption,
      correct: questions[currentIdx].correct,
      isCorrect: iCorrect,
      review: questions[currentIdx].review,
      options: questions[currentIdx].options
    }]);
    
    setIsAnswered(true);
  };

  const handleFinishQuiz = async () => {
    setIsQuizFinished(true);
    setLoading(true);
    try {
      // Calculate final score since interval might trigger this before the last 'handleCheck'
      let finalScore = 0;
      userAnswers.forEach(ans => {
        if (ans.isCorrect) finalScore++;
      });
      // If the user checked an answer but didn't click next
      if (isAnswered && selectedOption === questions[currentIdx].correct) {
          finalScore++;
      }
      
      const answeredCount = userAnswers.length + (isAnswered ? 1 : 0);
      const totalScore = isAnswered ? finalScore : score;
      
      const finalPercentage = Math.round((totalScore / questions.length) * 100) || 0;
      const xpToEarn = totalScore * 20;

      const finalAnswers = isAnswered ? [...userAnswers, {
          question: questions[currentIdx].text,
          selected: selectedOption,
          correct: questions[currentIdx].correct,
          isCorrect: selectedOption === questions[currentIdx].correct,
          review: questions[currentIdx].review,
          options: questions[currentIdx].options
      }] : userAnswers;

      // Only save progress if minimum 5 correct answers (matching Android requirement)
      if (totalScore >= 5) {
        await api.saveProgress({
          user_id: userId,
          grade: state?.grade || sessionManager.getGrade() || "8",
          subject: state?.subject || sessionManager.getSubject() || 'General',
          chapter: state?.chapterName || sessionManager.getChapterName() || 'Chapter',
          score: finalPercentage,
          xp: xpToEarn,
          badge: finalPercentage === 100 ? 'Gold' : (finalPercentage >= 80 ? 'Silver' : 'Bronze')
        });
      }
      
      setQuizResults({
        score: totalScore,
        total: questions.length,
        accuracy: finalPercentage,
        xpEarned: xpToEarn,
        userAnswers: finalAnswers
      });
      
    } catch (err) {
      console.error('Failed to save progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      handleFinishQuiz();
    }
  };

  if (loading) return <div className="app-container" style={{ padding: '40px', textAlign: 'center' }}>{isQuizFinished ? 'Saving Results...' : 'Preparing Quiz...'}</div>;
  if (!questions.length) return <div className="app-container" style={{ padding: '40px', textAlign: 'center' }}>No questions available.</div>;


  if (isQuizFinished && quizResults) {
    return (
      <div className="quiz-results-wrapper">
        <div className="quiz-results-container animate-fade">
          <div className="results-back-nav">
             <button onClick={() => navigate(-1)} className="circle-btn-outline">← Exit</button>
             <h2 className="results-top-title">Assessment Summary</h2>
          </div>
          
          <div className="vq-card results-hero-banner">
              <div className="hero-decoration">🎉</div>
              <h2 className="hero-greeting">Outstanding Effort, {sessionManager.getFullName()}!</h2>
              <p className="hero-subtext">You've successfully mastered the {state?.chapterName || sessionManager.getChapterName() || 'current'} module assessment.</p>
              <div className="final-score-pill">
                <span className="score-num">{quizResults.score}</span>
                <span className="score-sep">/</span>
                <span className="score-den">{quizResults.total}</span>
              </div>
          </div>

          <div className="results-stats-row">
              <div className="vq-card result-stat-card animate-fade" style={{ animationDelay: '0.1s' }}>
                  <div className="stat-mini-icon yellow-bg">⭐</div>
                  <div className="stat-mini-val">+{quizResults.xpEarned}</div>
                  <div className="stat-mini-lbl">XP Rewards</div>
              </div>
              <div className="vq-card result-stat-card animate-fade" style={{ animationDelay: '0.2s' }}>
                  <div className="stat-mini-icon green-bg">🎯</div>
                  <div className="stat-mini-val green-text">{quizResults.accuracy}%</div>
                  <div className="stat-mini-lbl">Accuracy Rate</div>
              </div>
              <div className="vq-card result-stat-card animate-fade" style={{ animationDelay: '0.3s' }}>
                  <div className="stat-mini-icon blue-bg">⚡</div>
                  <div className="stat-mini-val blue-text">+5%</div>
                  <div className="stat-mini-lbl">Level Progress</div>
              </div>
          </div>

          <h3 className="section-header-sm">Detailed Review</h3>
          <div className="review-list-container">
              {questions.map((q, idx) => {
                  const ans = quizResults.userAnswers[idx];
                  const isCorrect = ans && ans.isCorrect;
                  return (
                      <details key={idx} className={`vq-card review-detail-card animate-fade ${isCorrect ? 'correct-entry' : 'error-entry'}`}>
                          <summary className="review-summary-row">
                              <div className="review-q-header">
                                  <span className="status-emoji">{isCorrect ? '✅' : '❌'}</span>
                                  <span className="q-label-txt">Question {idx + 1}:</span>
                                  <span className="q-preview-txt">{q.text.length > 60 ? q.text.substring(0,60) + '...' : q.text}</span>
                              </div>
                              <span className={`review-badge-pill ${isCorrect ? 'badge-success' : 'badge-danger'}`}>
                                {isCorrect ? '+20 XP' : 'Needs Review'}
                              </span>
                          </summary>
                          <div className="review-expanded-content">
                              <div className="review-data-grid">
                                <div className="data-box">
                                  <label>Your Choice</label>
                                  <p className={isCorrect ? 'text-correct' : 'text-error'}>{ans && ans.selected !== null ? q.options[ans.selected] : 'Skipped'}</p>
                                </div>
                                <div className="data-box">
                                  <label>Correct Solution</label>
                                  <p className="text-correct">{q.options[q.correct]}</p>
                                </div>
                              </div>
                              {q.review && (
                                <div className="ai-explanation-box">
                                  <span className="ai-bulb">💡</span>
                                  <p><b>Learning Note:</b> {q.review}</p>
                                </div>
                              )}
                          </div>
                      </details>
                  );
              })}
          </div>

          {quizResults.score < 5 && (
            <div className="min-score-warning vq-card animate-fade" style={{ marginBottom: '24px', background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '28px' }}>⚠️</span>
              <p style={{ margin: 0, color: '#dc2626', fontWeight: 600, fontSize: '15px', lineHeight: 1.5 }}>
                You need at least 5 correct answers to save your progress and earn rewards. Please try again! 😊
              </p>
            </div>
          )}

          <div className="results-cta-actions">
              <button 
                className="btn-web-outline btn-lg-enhanced" 
                onClick={() => navigate(-1)}
              >
                ⚡ Retry Quiz
              </button>
              {quizResults.score >= 5 && (
                <button 
                  className="btn-web-primary btn-lg-enhanced" 
                  onClick={() => navigate('/rewards', { state: { justEarned: quizResults.xpEarned } })}
                >
                  Claim Rewards & Continue
                </button>
              )}
          </div>
        </div>

        <style>{`
          .quiz-results-wrapper { padding-bottom: 80px; }
          .quiz-results-container { max-width: 1000px; margin: 0 auto; width: 100%; }
          .results-back-nav { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
          .circle-btn-outline { background: white; border: 1px solid #e2e8f0; padding: 10px 24px; border-radius: 20px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
          .circle-btn-outline:hover { border-color: #f44336; color: #f44336; transform: translateX(-4px); }
          .results-top-title { margin: 0; font-size: 24px; font-weight: 800; }

          .results-hero-banner { text-align: center; padding: 64px 40px; margin-bottom: 32px; background: linear-gradient(to bottom right, white, #f8fafc); }
          .hero-decoration { font-size: 80px; margin-bottom: 24px; animation: pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
          @keyframes pop { from { transform: scale(0); } to { transform: scale(1); } }
          .hero-greeting { font-size: 32px; font-weight: 900; margin: 0 0 12px; }
          .hero-subtext { font-size: 16px; color: var(--text-secondary); margin-bottom: 40px; }
          
          .final-score-pill { display: inline-flex; align-items: baseline; gap: 8px; background: #f0fdf4; padding: 16px 40px; border-radius: 32px; border: 2px solid #4ade80; }
          .score-num { font-size: 48px; font-weight: 900; color: #166534; }
          .score-sep { font-size: 24px; color: #86efac; font-weight: 800; }
          .score-den { font-size: 32px; color: #166534; font-weight: 800; }

          .results-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; }
          .result-stat-card { padding: 32px; text-align: center; display: flex; flex-direction: column; align-items: center; }
          .stat-mini-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 12px; }
          .stat-mini-val { font-size: 24px; font-weight: 900; margin-bottom: 4px; }
          .stat-mini-lbl { font-size: 13px; color: var(--text-secondary); font-weight: 700; }

          .section-header-sm { font-size: 18px; font-weight: 800; margin-bottom: 24px; color: var(--text-main); }
          .review-list-container { display: flex; flex-direction: column; gap: 16px; margin-bottom: 64px; }
          .review-detail-card { border-left-width: 8px; cursor: pointer; transition: all 0.2s; }
          .review-detail-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
          .correct-entry { border-left-color: #4ade80; background: #f0fdf4 !important; }
          .error-entry { border-left-color: #f87171; background: #fef2f2 !important; }

          .review-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 20px; list-style: none; }
          .review-summary-row::-webkit-details-marker { display: none; }
          .review-q-header { display: flex; align-items: center; gap: 16px; flex: 1; }
          .status-emoji { font-size: 20px; }
          .q-label-txt { font-weight: 800; color: var(--text-main); font-size: 14px; white-space: nowrap; }
          .q-preview-txt { color: var(--text-secondary); font-size: 14px; font-weight: 600; }

          .review-badge-pill { font-size: 12px; font-weight: 800; padding: 6px 16px; border-radius: 20px; }
          .badge-success { background: #dcfce7; color: #166534; }
          .badge-danger { background: #fee2e2; color: #991b1b; }

          .review-expanded-content { padding: 24px; border-top: 1px solid rgba(0,0,0,0.05); }
          .review-data-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 24px; }
          .data-box label { display: block; font-size: 12px; font-weight: 800; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
          .data-box p { font-size: 16px; font-weight: 700; margin: 0; line-height: 1.4; }
          .text-correct { color: #166534; }
          .text-error { color: #991b1b; }

          .ai-explanation-box { background: rgba(255,255,255,0.6); padding: 20px; border-radius: 16px; display: flex; gap: 16px; align-items: flex-start; }
          .ai-bulb { font-size: 24px; }
          .ai-explanation-box p { margin: 0; font-size: 14px; line-height: 1.6; color: #475569; }

          .results-cta-actions { display: flex; gap: 24px; }
          .btn-lg-enhanced { flex: 1; padding: 24px; border-radius: 20px; font-size: 18px; font-weight: 900; }

          @media (max-width: 768px) {
            .results-stats-row { grid-template-columns: 1fr; }
            .results-cta-actions { flex-direction: column; }
            .hero-greeting { font-size: 24px; }
            .review-data-grid { grid-template-columns: 1fr; }
            .review-summary-row { flex-direction: column; align-items: flex-start; gap: 12px; }
            .review-badge-pill { align-self: flex-end; }
          }
        `}</style>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="active-quiz-wrapper">
      <div className="quiz-container-layout animate-fade">
        <div className="quiz-main-section">
          <div className="quiz-sticky-header">
            <div className="header-nav-ctx">
               <button onClick={() => navigate(-1)} className="quiz-back-btn">← Quit</button>
               <div className="quiz-progress-meta">
                  <span className="current-step">Question {currentIdx + 1}</span>
                  <span className="total-steps">of {questions.length}</span>
               </div>
            </div>
            <div className="quiz-timer-pill">
              <span className={`timer-clock ${timeRemaining < 60 ? 'timer-warning' : ''}`}>🕒</span>
              <span className={`timer-value ${timeRemaining < 60 ? 'timer-warning' : ''}`}>{formattedTime()}</span>
            </div>
          </div>

          <div className="quiz-progress-track">
            <div className="track-inner" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>

          <div className="question-surface active-animate">
            <h2 className="question-text-content">{currentQ.text}</h2>
            
            <div className="options-grid-layout">
              {currentQ.options.map((optionText, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correct;
                
                let btnStateClass = '';
                if (isAnswered) {
                  if (isCorrect) btnStateClass = 'state-correct';
                  else if (isSelected) btnStateClass = 'state-error';
                  else btnStateClass = 'state-disabled';
                } else if (isSelected) {
                  btnStateClass = 'state-selected';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => setSelectedOption(idx)}
                    className={`quiz-option-btn ${btnStateClass}`}
                  >
                    <div className="option-indicator">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="option-content-txt">
                      {optionText || <i className="missing-data">Option text missing</i>}
                    </div>
                    {isAnswered && isCorrect && <span className="state-icon-mini">✅</span>}
                    {isAnswered && isSelected && !isCorrect && <span className="state-icon-mini">❌</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {isAnswered && (
            <div className={`review-insight-panel animate-slide-up ${selectedOption === currentQ.correct ? 'insight-success' : 'insight-neutral'}`}>
              <div className="insight-header">
                <span className="insight-emoji">{selectedOption === currentQ.correct ? '🎯' : '💡'}</span>
                <span className="insight-title">{selectedOption === currentQ.correct ? 'Brilliant Solution!' : 'Knowledge Expansion'}</span>
              </div>
              <p className="insight-message">{currentQ.review}</p>
            </div>
          )}
        </div>

        <div className="quiz-control-sidebar">
           <div className="sidebar-info-card">
              <h4 className="card-lbl">Current Mission</h4>
              <p className="card-val">{state?.chapterName || sessionManager.getChapterName() || 'Module Assessment'}</p>
              <div className="meta-stats-mini">
                 <div className="m-stat">
                    <span>Accuracy</span>
                    <b>{Math.round((score / (isAnswered ? currentIdx + 1 : currentIdx || 1)) * 100)}%</b>
                 </div>
                 <div className="m-stat">
                    <span>XP Goal</span>
                    <b>{questions.length * 20}</b>
                 </div>
              </div>
           </div>

           <div className="quiz-actions-container">
             {!isAnswered ? (
               <button 
                 className="btn-web-primary btn-submit-step" 
                 disabled={selectedOption === null}
                 onClick={handleCheck}
               >
                 Verify Answer
               </button>
             ) : (
               <button 
                 className="btn-web-primary btn-submit-step continue-anim" 
                 onClick={handleNext}
               >
                 {currentIdx === questions.length - 1 ? 'Finish Assessment' : 'Next Question ➔'}
               </button>
             )}
             <p className="action-hint-txt">
               {!isAnswered ? 'Select an option to proceed' : 'Review the feedback above'}
             </p>
           </div>
        </div>
      </div>

      <style>{`
        .active-quiz-wrapper {
          min-height: calc(100vh - 100px);
          display: flex;
          background: #fdfdfd;
        }

        .quiz-container-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 40px 24px;
        }

        .quiz-main-section {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .quiz-sticky-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-nav-ctx { display: flex; align-items: center; gap: 24px; }
        .quiz-back-btn { background: white; border: 1px solid #e2e8f0; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; color: #64748b; }
        .quiz-back-btn:hover { color: #f44336; border-color: #f44336; }
        
        .quiz-progress-meta { display: flex; flex-direction: column; }
        .current-step { font-size: 18px; font-weight: 900; color: var(--text-main); line-height: 1; }
        .total-steps { font-size: 13px; color: var(--text-secondary); font-weight: 600; margin-top: 4px; }

        .quiz-timer-pill { background: white; border: 1px solid #e2e8f0; padding: 12px 24px; border-radius: 20px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .timer-clock { font-size: 20px; }
        .timer-value { font-size: 18px; font-weight: 900; color: var(--text-main); font-family: monospace; }
        .timer-warning { color: #ef4444 !important; animation: shake 0.5s infinite; }
        @keyframes shake { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }

        .quiz-progress-track { height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; position: relative; }
        .track-inner { height: 100%; background: var(--green-primary); border-radius: 5px; transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }

        .question-surface { background: white; padding: 56px; border-radius: 32px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.02); }
        .question-text-content { font-size: 28px; font-weight: 800; line-height: 1.5; margin: 0 0 56px; text-align: center; color: var(--text-main); }

        .options-grid-layout { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .quiz-option-btn { display: flex; align-items: center; gap: 20px; padding: 24px; background: #f8fafc; border: 2px solid transparent; border-radius: 20px; cursor: pointer; transition: all 0.2s; text-align: left; position: relative; }
        .quiz-option-btn:hover:not(:disabled) { transform: translateY(-3px); background: white; border-color: #cbd5e1; box-shadow: 0 10px 20px rgba(0,0,0,0.04); }
        
        .option-indicator { width: 40px; height: 40px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #94a3b8; transition: all 0.2s; }
        .option-content-txt { font-size: 17px; font-weight: 600; color: var(--text-main); flex: 1; }

        .state-selected { border-color: var(--green-primary) !important; background: #f0fdf4 !important; }
        .state-selected .option-indicator { background: var(--green-primary); color: white; border-color: var(--green-primary); }
        .state-selected .option-content-txt { color: #166534; }

        .state-correct { border-color: #22c55e !important; background: #f0fdf4 !important; }
        .state-correct .option-indicator { background: #22c55e; color: white; border-color: #22c55e; }
        .state-correct .option-content-txt { color: #166534; }

        .state-error { border-color: #f87171 !important; background: #fef2f2 !important; }
        .state-error .option-indicator { background: #f87171; color: white; border-color: #f87171; }
        .state-error .option-content-txt { color: #991b1b; }
        .state-disabled { opacity: 0.6; }

        .state-icon-mini { font-size: 18px; }

        .review-insight-panel { padding: 32px; border-radius: 24px; border-left: 8px solid; animation: slideUp 0.4s ease-out; }
        .insight-success { background: #f0fdf4; border-color: #4ade80; }
        .insight-neutral { background: #fff7ed; border-color: #fdba74; }
        
        .insight-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .insight-emoji { font-size: 24px; }
        .insight-title { font-size: 18px; font-weight: 800; }
        .insight-message { margin: 0; font-size: 15px; line-height: 1.6; color: #475569; }

        .quiz-control-sidebar { display: flex; flex-direction: column; gap: 24px; }
        .sidebar-info-card { background: white; padding: 32px; border-radius: 24px; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .card-lbl { margin: 0 0 8px; font-size: 12px; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
        .card-val { margin: 0 0 24px; font-size: 18px; font-weight: 800; color: var(--text-main); }
        .meta-stats-mini { display: flex; flex-direction: column; gap: 16px; }
        .m-stat { display: flex; justify-content: space-between; font-size: 14px; padding: 12px 0; border-top: 1px dashed #e2e8f0; }
        .m-stat span { color: var(--text-secondary); font-weight: 600; }
        .m-stat b { color: var(--text-main); font-weight: 800; }

        .btn-submit-step { width: 100%; padding: 24px; border-radius: 16px; font-size: 18px; font-weight: 900; }
        .continue-anim { animation: pulseActive 2s infinite; }
        @keyframes pulseActive { 0% { transform: scale(1); } 50% { transform: scale(1.02); box-shadow: 0 10px 30px rgba(46, 125, 50, 0.2); } 100% { transform: scale(1); } }
        .action-hint-txt { text-align: center; font-size: 13px; color: var(--text-secondary); margin-top: 12px; font-weight: 600; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1024px) {
          .quiz-container-layout { grid-template-columns: 1fr; }
          .quiz-control-sidebar { order: -1; }
          .sidebar-info-card { display: flex; justify-content: space-between; align-items: center; padding: 20px; }
          .meta-stats-mini { flex-direction: row; gap: 32px; border: none; }
          .m-stat { border: none; padding: 0; }
          .card-val { margin-bottom: 0; }
        }

        @media (max-width: 768px) {
          .options-grid-layout { grid-template-columns: 1fr; }
          .question-surface { padding: 32px 24px; }
          .question-text-content { font-size: 20px; margin-bottom: 32px; }
        }
      `}</style>
    </div>
  );
};

export default QuizPage;
