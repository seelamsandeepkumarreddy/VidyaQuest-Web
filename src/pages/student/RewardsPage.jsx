import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';
import BottomNav from '../../components/BottomNav';

const RewardsPage = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const userId = sessionManager.getUserId();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await api.getProgress(userId);
        setProgress(data);
      } catch (err) {
        console.error('Failed to fetch rewards info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [userId]);

  const streakCount = sessionManager.getStreakCount();

  const globalAchievements = [
    { id: 'quick_learner', name: 'Quick Learner', icon: '⭐', description: 'Complete 10 lessons', color: '#FBC02D', bg: '#FFF8E1', unlocked: (progress?.quiz_count || 0) >= 10 },
    { id: 'quiz_master', name: 'Quiz Master', icon: '🏆', description: 'Score 80%+ on 5 quizzes', color: '#FFA000', bg: '#FFF3E0', unlocked: (progress?.high_accuracy_quizzes || 0) >= 5 },
    { id: 'perfect_score', name: 'Perfect Score', icon: '🎯', description: 'Get 100% on any quiz', color: '#4DB6AC', bg: '#E0F2F1', unlocked: (progress?.perfect_quizzes || 0) >= 1 },
    { id: 'bookworm', name: 'Bookworm', icon: '📖', description: 'Visit Dashboard 5 times', color: '#81C784', bg: '#E8F5E9', unlocked: (progress?.quiz_count || 0) > 0 }, // Simplified
    { id: 'streak_7', name: '7 Day Streak', icon: '🔥', description: 'Learn for 7 days in a row', color: '#FF7043', bg: '#FFE0B2', unlocked: streakCount >= 7 },
    { id: 'top_class', name: 'Top of Class', icon: '🎖️', description: 'Reach #1 on leaderboard', color: '#9575CD', bg: '#EDE7F6', unlocked: false }, // Dynamic rank check would go here
  ];

  const subjectBadges = [];
  if (progress?.earned_badges) {
    Object.entries(progress.earned_badges).forEach(([subject, chapters]) => {
      Object.entries(chapters).forEach(([chapter, badgeType]) => {
        subjectBadges.push({ subject, chapter, type: badgeType });
      });
    });
  }

  const earnedGlobalCount = globalAchievements.filter(a => a.unlocked).length;
  const totalEarned = earnedGlobalCount + subjectBadges.length;
  const lockedGlobalCount = globalAchievements.length - earnedGlobalCount;
  const completionPercent = (totalEarned > 0 || lockedGlobalCount > 0) 
    ? Math.round((totalEarned * 100) / (totalEarned + lockedGlobalCount)) : 0;

  return (
    <div className="rewards-wrapper">
      {/* Hero Header Section */}
      <div className="rewards-hero">
        <div className="rewards-hero-content">
          <div className="hero-badge-container animate-bounce-slow">
            <div className="hero-avatar-circle">🏆</div>
            <div className="hero-star-badge">⭐</div>
          </div>
          <h1 className="hero-title">Trophy Room</h1>
          <p className="hero-subtitle">You have unlocked {totalEarned} achievements so far!</p>
          
          <div className="hero-progress-container">
            <div className="progress-labels">
               <span>Collection Progress</span>
               <span>{completionPercent}%</span>
            </div>
            <div className="hero-progress-bar">
               <div className="hero-progress-fill" style={{ width: `${completionPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="rewards-container-layout">
        <div className="rewards-sections-grid">
           {/* Special Achievements */}
           <section className="rewards-section">
              <h3 className="section-title">
                <span className="section-icon">🎖️</span> Special Achievements
              </h3>
              <div className="achievements-grid">
                {globalAchievements.map((badge) => (
                  <div key={badge.id} className={`achievement-card ${badge.unlocked ? 'unlocked' : 'locked'} animate-fade`}>
                    <div className="badge-icon-box" style={{ background: badge.unlocked ? badge.bg : '#f1f5f9', color: badge.unlocked ? badge.color : '#94a3b8' }}>
                      {badge.unlocked ? badge.icon : '🔒'}
                    </div>
                    <h4 className="badge-name">{badge.name}</h4>
                    <p className="badge-desc">{badge.description}</p>
                    {badge.unlocked && <div className="unlocked-indicator">UNLOCKED</div>}
                  </div>
                ))}
              </div>
           </section>

           {/* Subject Trophies */}
           {subjectBadges.length > 0 && (
             <section className="rewards-section">
                <h3 className="section-title">
                   <span className="section-icon">🏆</span> Subject Trophies
                </h3>
                <div className="trophy-list">
                   {subjectBadges.map((badge, i) => {
                     let color = '#FFD700';
                     if (badge.type === 'Silver') color = '#C0C0C0';
                     if (badge.type === 'Bronze') color = '#CD7F32';
                     
                     return (
                       <div key={i} className="vq-card trophy-row-card animate-fade" style={{ animationDelay: `${i * 0.05}s` }}>
                          <div className="trophy-icon" style={{ color }}>🏆</div>
                          <div className="trophy-info">
                             <h4 className="trophy-name">{badge.type} Trophy</h4>
                             <p className="trophy-meta">{badge.subject} • {badge.chapter}</p>
                          </div>
                          <div className="earned-label">COLLECTED</div>
                       </div>
                     );
                   })}
                </div>
             </section>
           )}
        </div>
      </div>

      <style>{`
        .rewards-hero {
          background: linear-gradient(135deg, var(--green-primary) 0%, #1b5e20 100%);
          color: white;
          padding: 80px 24px;
          border-radius: 24px;
          text-align: center;
          margin-bottom: 48px;
          box-shadow: 0 20px 40px rgba(46, 125, 50, 0.2);
        }

        .hero-badge-container {
          position: relative;
          display: inline-block;
          margin-bottom: 24px;
        }

        .hero-avatar-circle {
          width: 100px;
          height: 100px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .hero-star-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #FFD700;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .hero-title {
          font-size: 40px;
          font-weight: 900;
          margin: 0 0 12px;
        }

        .hero-subtitle {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: 32px;
        }

        .hero-progress-container {
          max-width: 400px;
          margin: 0 auto;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .hero-progress-bar {
          height: 12px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          overflow: hidden;
        }

        .hero-progress-fill {
          height: 100%;
          background: white;
          border-radius: 6px;
          transition: width 1s ease-out;
        }

        .rewards-container-layout {
          max-width: 1100px;
          margin: 0 auto 100px;
        }

        .rewards-sections-grid {
          display: flex;
          flex-direction: column;
          gap: 64px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
          color: var(--text-main);
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 24px;
        }

        .achievement-card {
          background: white;
          padding: 32px 20px;
          border-radius: 24px;
          text-align: center;
          position: relative;
          box-shadow: 0 10px 20px rgba(0,0,0,0.02);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .achievement-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
        }

        .achievement-card.locked {
          opacity: 0.6;
          background: #f8fafc;
          border-style: dashed;
        }

        .badge-icon-box {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 32px;
        }

        .badge-name {
          font-size: 16px;
          font-weight: 800;
          margin: 0 0 8px;
        }

        .badge-desc {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0;
        }

        .unlocked-indicator {
          margin-top: 16px;
          font-size: 10px;
          font-weight: 900;
          color: var(--green-primary);
          background: #E8F5E9;
          padding: 4px 12px;
          border-radius: 12px;
          display: inline-block;
        }

        .trophy-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .trophy-row-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px !important;
          transition: all 0.2s ease;
        }

        .trophy-row-card:hover {
          transform: scale(1.02);
          border-color: var(--green-primary);
        }

        .trophy-icon {
          font-size: 32px;
        }

        .trophy-info {
          flex: 1;
        }

        .trophy-name {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 800;
        }

        .trophy-meta {
          margin: 0;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .earned-label {
          font-size: 11px;
          font-weight: 900;
          color: var(--green-primary);
          background: #E8F5E9;
          padding: 6px 12px;
          border-radius: 20px;
        }

        @media (max-width: 768px) {
          .rewards-hero {
            padding: 48px 20px;
          }
          .hero-title { font-size: 32px; }
          .achievements-grid { grid-template-columns: repeat(2, 1fr); }
          .trophy-list { grid-template-columns: 1fr; }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default RewardsPage;
