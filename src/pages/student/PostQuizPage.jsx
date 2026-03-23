import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';

const PostQuizPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  if (!state) return <div className="app-container">Loading score...</div>;
  
  const { score, total, userAnswers } = state;
  const percentage = (score / total) * 100;
  const xpEarned = score * 10;
  
  let badge = '🏆 Excellent';
  let badgeColor = '#FFD700';
  if (percentage === 100) {
    badge = '🥇 Gold Badge';
    badgeColor = '#FFD700';
  } else if (percentage >= 80) {
    badge = '🥈 Silver Badge';
    badgeColor = '#94a3b8';
  } else {
    badge = '🥉 Bronze Badge';
    badgeColor = '#d97706';
  }

  return (
    <div className="post-quiz-wrapper">
      <div className="post-quiz-container-layout animate-fade">
        <div className="results-hero-card">
          <div className="confetti-icon">🎉</div>
          <h1 className="results-headline">Quiz Mission Accomplished!</h1>
          <p className="results-subline">You've successfully completed the evaluation</p>
          
          <div className="score-display-ring">
            <div className="score-value-text">{score} <span className="score-total">/ {total}</span></div>
            <div className="score-label-text">TOTAL SCORE</div>
          </div>

          <div className="rewards-flex-row">
            <div className="reward-pill-item xp-pill">
              <span className="pill-icon">⚡</span>
              <div className="pill-texts">
                <span className="pill-val">+{xpEarned}</span>
                <span className="pill-label">XP EARNED</span>
              </div>
            </div>
            <div className="reward-pill-item badge-pill" style={{ borderColor: badgeColor }}>
              <span className="pill-icon">{badge.split(' ')[0]}</span>
              <div className="pill-texts">
                <span className="pill-val" style={{ color: badgeColor }}>{badge.split(' ')[1]}</span>
                <span className="pill-label">ACHIEVEMENT</span>
              </div>
            </div>
          </div>
        </div>

        <div className="review-summary-section">
          <h3 className="section-title-md">Performance Deep-Dive</h3>
          <div className="review-cards-stack">
            {userAnswers && userAnswers.map((item, idx) => (
              <div key={idx} className={`review-item-card animate-fade ${item.isCorrect ? 'correct-border' : 'error-border'}`} style={{ animationDelay: `${0.2 + (idx * 0.05)}s` }}>
                <div className="review-card-top">
                   <div className="q-number-pill">Question {idx + 1}</div>
                   <div className={`status-pill ${item.isCorrect ? 'status-correct' : 'status-error'}`}>
                     {item.isCorrect ? 'CORRECT' : 'INCORRECT'}
                   </div>
                </div>
                
                <h4 className="review-q-text">{item.question}</h4>
                
                {!item.isCorrect && (
                  <div className="correct-answer-reveal">
                    <p className="reveal-label">Correct Solution:</p>
                    <p className="reveal-value">{item.options[item.correct]}</p>
                  </div>
                )}
                
                <div className="ai-review-box">
                  <span className="ai-icon">🤖</span>
                  <p className="ai-review-text">"{item.review}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="post-quiz-actions">
          <button 
            className="btn-web-primary btn-huge" 
            onClick={() => navigate('/subjects')}
          >
            Explore More Subjects
          </button>
          <button 
            className="btn-web-outline btn-huge" 
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </button>
        </div>
      </div>

      <style>{`
        .post-quiz-wrapper {
          padding-bottom: 100px;
        }

        .post-quiz-container-layout {
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }

        .results-hero-card {
          background: white;
          border-radius: 40px;
          padding: 64px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
          margin-bottom: 48px;
          position: relative;
          overflow: hidden;
        }

        .confetti-icon { font-size: 72px; margin-bottom: 24px; animation: bounce 2s infinite; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .results-headline { font-size: 36px; font-weight: 900; color: var(--text-main); margin: 0 0 12px; }
        .results-subline { font-size: 16px; color: var(--text-secondary); font-weight: 600; margin-bottom: 48px; }

        .score-display-ring {
          width: 240px;
          height: 240px;
          border: 12px solid #f1f5f9;
          border-top-color: var(--green-primary);
          border-radius: 50%;
          margin: 0 auto 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #fdfdfd;
          box-shadow: inset 0 4px 15px rgba(0,0,0,0.02);
        }

        .score-value-text { font-size: 56px; font-weight: 900; color: var(--green-primary); }
        .score-total { font-size: 28px; color: #cbd5e1; }
        .score-label-text { font-size: 12px; font-weight: 800; color: #94a3b8; letter-spacing: 2px; margin-top: 8px; }

        .rewards-flex-row { display: flex; gap: 24px; justify-content: center; }
        
        .reward-pill-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 32px;
          background: white;
          border-radius: 20px;
          border: 2px solid #f1f5f9;
          transition: transform 0.2s ease;
        }

        .reward-pill-item:hover { transform: translateY(-5px); }
        .pill-icon { font-size: 32px; }
        .pill-texts { text-align: left; }
        .pill-val { display: block; font-size: 20px; font-weight: 900; line-height: 1.2; }
        .xp-pill .pill-val { color: var(--green-primary); }
        .pill-label { font-size: 11px; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; }

        .section-title-md { font-size: 24px; font-weight: 800; margin-bottom: 32px; color: var(--text-main); text-align: center; }

        .review-cards-stack { display: flex; flex-direction: column; gap: 24px; }
        
        .review-item-card {
          background: white;
          padding: 32px;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
          border: 1px solid #f1f5f9;
          border-left-width: 8px;
        }

        .correct-border { border-left-color: #4ade80; }
        .error-border { border-left-color: #f87171; }

        .review-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .q-number-pill { font-size: 14px; font-weight: 800; color: var(--text-secondary); background: #f8fafc; padding: 6px 16px; border-radius: 12px; }
        
        .status-pill { padding: 6px 16px; border-radius: 12px; font-size: 12px; font-weight: 900; letter-spacing: 0.5px; }
        .status-correct { background: #dcfce7; color: #166534; }
        .status-error { background: #fee2e2; color: #991b1b; }

        .review-q-text { font-size: 20px; font-weight: 700; color: var(--text-main); margin: 0 0 24px; line-height: 1.5; }

        .correct-answer-reveal { background: #f0fdf4; border: 1px dashed #4ade80; padding: 20px; border-radius: 16px; margin-bottom: 24px; }
        .reveal-label { font-size: 13px; font-weight: 800; color: #166534; margin: 0 0 8px; }
        .reveal-value { font-size: 16px; font-weight: 700; color: #14532d; margin: 0; }

        .ai-review-box { display: flex; gap: 16px; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; }
        .ai-icon { font-size: 24px; }
        .ai-review-text { margin: 0; font-size: 14px; line-height: 1.6; color: #64748b; font-style: italic; font-weight: 500; }

        .post-quiz-actions { display: flex; gap: 24px; margin-top: 64px; }
        .btn-huge { flex: 1; padding: 24px; border-radius: 20px; font-size: 18px; font-weight: 800; }

        @media (max-width: 768px) {
          .results-hero-card { padding: 32px 20px; }
          .rewards-flex-row { flex-direction: column; }
          .post-quiz-actions { flex-direction: column; gap: 16px; }
          .score-display-ring { width: 180px; height: 180px; }
          .score-value-text { font-size: 40px; }
        }
      `}</style>
    </div>
  );
};

export default PostQuizPage;
