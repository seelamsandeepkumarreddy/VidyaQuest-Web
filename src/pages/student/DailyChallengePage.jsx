import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';
import BottomNav from '../../components/BottomNav';

const DailyChallengePage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  
  const navigate = useNavigate();
  const userId = sessionManager.getUserId();
  const grade = sessionManager.getGrade();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const data = await api.getChallenge(grade);
        setChallenge(data);
      } catch (err) {
        console.error('Failed to fetch challenge:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [grade]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight - now;
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      
      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    if (selectedOption === null || submitting) return;
    setSubmitting(true);
    try {
      const currentQ = challenge.questions[0];
      const isCorrect = selectedOption === currentQ.correct_option_index;
      const xpEarned = isCorrect ? 100 : 50;
      const bonusXp = isCorrect ? 100 : 0;
      
      await api.saveProgress({
        user_id: userId,
        grade: grade,
        subject: 'Daily Challenge',
        chapter: challenge.title,
        score: isCorrect ? 100 : 0,
        xp: xpEarned,
        badge: isCorrect ? 'Gold' : null
      });

      sessionManager.addDailyXp(xpEarned);
      navigate('/quiz/results', { state: { score: isCorrect ? 1 : 0, total: 1, isChallenge: true, bonusXp } });
    } catch (err) {
      console.error('Failed to submit challenge:', err);
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="loading-state-full">
      <div className="loader"></div>
      <p>Preparing Today's Challenge...</p>
    </div>
  );

  if (!challenge) return (
    <div className="challenge-empty-state">
      <div className="empty-icon-large">⚡</div>
      <h3>No Challenge Available</h3>
      <p>Check back later for a new academic mission!</p>
      <button onClick={() => navigate('/dashboard')} className="vq-button btn-secondary">Back to Dashboard</button>
    </div>
  );

  if (!isStarted) {
    return (
      <div className="challenge-hero-wrapper">
        <div className="challenge-header-bar">
          <div className="back-btn-container">
            <button onClick={() => navigate(-1)} className="circle-btn-white">←</button>
            <h2 className="header-title-lg">Daily Academic Challenge</h2>
          </div>
          <div className="online-status-pill">
            <span className="dot"></span> Online
          </div>
        </div>

        <div className="challenge-intro-layout animate-fade">
          {/* Left Side: Illustration & Hero Card */}
          <div className="challenge-intro-main">
            <div className="challenge-hero-banner">
              <div className="hero-lightning-icon">⚡</div>
              <h1 className="hero-challenge-title">{challenge.title}</h1>
              <div className="hero-timer-box">
                <span className="timer-icon">🕒</span>
                <span className="timer-countdown">Ends in: {timeLeft}</span>
              </div>
            </div>

            <div className="challenge-details-grid">
              <div className="detail-item-card">
                <div className="detail-icon-box blue-bg">📖</div>
                <div className="detail-texts">
                  <div className="detail-val">{challenge.questions?.length || 0} Questions</div>
                  <div className="detail-sub">Teacher curated problems</div>
                </div>
              </div>
              <div className="detail-item-card">
                <div className="detail-icon-box green-bg">🕒</div>
                <div className="detail-texts">
                  <div className="detail-val">5 Minutes</div>
                  <div className="detail-sub">Recommended time limit</div>
                </div>
              </div>
              <div className="detail-item-card">
                <div className="detail-icon-box yellow-bg">⭐</div>
                <div className="detail-texts">
                  <div className="detail-val">100 Bonus XP</div>
                  <div className="detail-sub">Earn for correct answer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Start Action & Rewards */}
          <div className="challenge-intro-side">
            <div className="rewards-preview-card">
              <h4 className="rewards-title"><span className="gift-icon">🎁</span> Academic Rewards</h4>
              <div className="rewards-icons-flex">
                <div className="reward-item-mini">
                  <div className="reward-icon-gold">🏆</div>
                  <div className="reward-txt-primary">100 XP</div>
                  <div className="reward-txt-sec">Correct Ans</div>
                </div>
                <div className="reward-item-mini">
                  <div className="reward-icon-blue">⚡</div>
                  <div className="reward-txt-primary">50 XP</div>
                  <div className="reward-txt-sec">Participation</div>
                </div>
              </div>
            </div>

            <button 
              className="btn-start-challenge-huge animate-bounce-subtle" 
              onClick={() => setIsStarted(true)}
            >
              Start Mission Now
            </button>
          </div>
        </div>

        <style>{`
          .challenge-hero-wrapper { padding-top: 20px; }
          .challenge-header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px; }
          .back-btn-container { display: flex; align-items: center; gap: 20px; }
          .circle-btn-white { background: white; border: 1px solid #e2e8f0; width: 48px; height: 48px; border-radius: 50%; font-size: 20px; cursor: pointer; transition: all 0.2s; }
          .circle-btn-white:hover { transform: translateX(-4px); border-color: var(--green-primary); color: var(--green-primary); }
          .header-title-lg { font-size: 24px; font-weight: 800; margin: 0; }
          .online-status-pill { background: #e8f5e9; color: #1b5e20; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
          .online-status-pill .dot { width: 8px; height: 8px; background: #1b5e20; border-radius: 50%; }

          .challenge-intro-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; max-width: 1100px; margin: 0 auto; }
          .challenge-hero-banner { background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); padding: 64px 40px; border-radius: 32px; color: white; text-align: center; box-shadow: 0 20px 40px rgba(255, 152, 0, 0.2); margin-bottom: 40px; }
          .hero-lightning-icon { font-size: 64px; margin-bottom: 24px; }
          .hero-challenge-title { font-size: 36px; font-weight: 900; margin: 0 0 16px; }
          .hero-timer-box { background: rgba(255,255,255,0.2); padding: 10px 24px; border-radius: 20px; display: inline-flex; align-items: center; gap: 10px; font-weight: 800; font-size: 16px; }

          .challenge-details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
          .detail-item-card { background: white; padding: 24px; border-radius: 24px; border: 1px solid #f1f5f9; display: flex; align-items: center; gap: 16px; }
          .detail-icon-box { min-width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
          .blue-bg { background: #e3f2fd; }
          .green-bg { background: #e8f5e9; }
          .yellow-bg { background: #fffde7; }
          .detail-val { font-size: 16px; font-weight: 800; }
          .detail-sub { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

          .rewards-preview-card { background: white; border-radius: 32px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; margin-bottom: 32px; }
          .rewards-title { margin: 0 0 32px; font-size: 18px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 12px; }
          .rewards-icons-flex { display: flex; justify-content: space-around; text-align: center; }
          .reward-icon-gold { font-size: 32px; margin-bottom: 8px; }
          .reward-icon-blue { font-size: 32px; margin-bottom: 8px; }
          .reward-txt-primary { font-size: 16px; font-weight: 900; color: var(--green-primary); }
          .reward-txt-sec { font-size: 11px; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; margin-top: 4px; }

          .btn-start-challenge-huge { width: 100%; padding: 32px; background: var(--green-primary); color: white; border: none; border-radius: 24px; font-size: 24px; font-weight: 900; cursor: pointer; box-shadow: 0 20px 40px rgba(46, 125, 50, 0.2); transition: all 0.3s; }
          .btn-start-challenge-huge:hover { transform: scale(1.02) translateY(-5px); box-shadow: 0 30px 60px rgba(46, 125, 50, 0.3); }

          @media (max-width: 1024px) {
            .challenge-intro-layout { grid-template-columns: 1fr; }
            .challenge-details-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="active-challenge-wrapper">
      <div className="active-challenge-container animate-fade">
        <div className="active-header">
           <div className="header-left">
             <button onClick={() => setIsStarted(false)} className="mini-back-btn">← Quit</button>
             <h3 className="active-challenge-title">⚡ Daily Mission: {challenge.title}</h3>
           </div>
           <div className="active-timer">
              <span className="clock">🕒</span> {timeLeft}
           </div>
        </div>

        <div className="question-surface-card">
           <div className="question-icon-head">💡 Topic Insight</div>
           <h2 className="main-question-text">{challenge.questions?.[0]?.text || challenge.description}</h2>
           
           <div className="options-layout-grid">
             {challenge.questions?.[0]?.options?.map((optionText, idx) => {
               const isSelected = selectedOption === idx;
               return (
                 <button
                   key={idx}
                   onClick={() => setSelectedOption(idx)}
                   className={`option-btn-web ${isSelected ? 'selected' : ''}`}
                 >
                   <div className="option-index">{String.fromCharCode(65 + idx)}</div>
                   <div className="option-content-text">{optionText}</div>
                   {isSelected && <div className="option-check">✓</div>}
                 </button>
               );
             })}
           </div>
        </div>

        <div className="action-footer-sticky">
           <div className="footer-content-flex">
             <p className="footer-hint-text">Choose the best answer based on your knowledge</p>
             <button 
               className="btn-submit-mission" 
               disabled={selectedOption === null || submitting}
               onClick={handleSubmit}
             >
               {submitting ? 'Verifying Mission...' : 'Submit Mission'}
             </button>
           </div>
        </div>
      </div>

      <style>{`
        .active-challenge-wrapper { min-height: 100vh; background: #fbfbfb; display: flex; flex-direction: column; }
        .active-challenge-container { max-width: 1000px; margin: 0 auto; width: 100%; padding: 40px 24px 140px; }
        .active-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .mini-back-btn { background: white; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 12px; font-weight: 700; cursor: pointer; color: #f44336; }
        .active-challenge-title { margin: 0; font-size: 20px; font-weight: 800; margin-left: 20px; display: inline-block; }
        .active-timer { background: #fee2e2; color: #ef4444; padding: 10px 20px; border-radius: 20px; font-weight: 900; font-family: monospace; font-size: 20px; }

        .question-surface-card { background: white; padding: 64px 48px; border-radius: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
        .question-icon-head { font-size: 14px; font-weight: 800; color: #ef6c00; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
        .main-question-text { font-size: 28px; font-weight: 800; line-height: 1.5; margin-bottom: 48px; color: var(--text-main); }

        .options-layout-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .option-btn-web { display: flex; align-items: center; gap: 20px; padding: 24px; background: #f8fafc; border: 2px solid transparent; border-radius: 20px; text-align: left; cursor: pointer; transition: all 0.2s; position: relative; }
        .option-btn-web:hover { background: white; border-color: #cbd5e1; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.02); }
        .option-btn-web.selected { background: #fff7ed; border-color: #fdba74; box-shadow: 0 10px 20px rgba(251, 146, 60, 0.1); }

        .option-index { width: 44px; height: 44px; background: white; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #f97316; flex-shrink: 0; }
        .selected .option-index { background: #f97316; color: white; border-color: #f97316; }
        .option-content-text { font-size: 18px; font-weight: 600; color: var(--text-main); }
        .selected .option-content-text { color: #c2410c; }
        .option-check { position: absolute; right: 24px; width: 24px; height: 24px; background: #f97316; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; }

        .action-footer-sticky { position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 24px; border-top: 1px solid #f1f5f9; box-shadow: 0 -10px 30px rgba(0,0,0,0.03); z-index: 100; }
        .footer-content-flex { max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .footer-hint-text { margin: 0; font-size: 14px; color: var(--text-secondary); font-weight: 600; }
        .btn-submit-mission { padding: 20px 48px; background: #f97316; color: white; border: none; border-radius: 16px; font-size: 18px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .btn-submit-mission:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(249, 115, 22, 0.2); }
        .btn-submit-mission:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 768px) {
          .options-layout-grid { grid-template-columns: 1fr; }
          .main-question-text { font-size: 22px; }
          .question-surface-card { padding: 32px 24px; }
          .footer-content-flex { flex-direction: column; gap: 20px; text-align: center; }
          .btn-submit-mission { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default DailyChallengePage;
