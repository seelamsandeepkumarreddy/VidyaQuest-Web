import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';
import BottomNav from '../../components/BottomNav';

const DashboardPage = () => {
  const [progress, setProgress] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [rank, setRank] = useState('--');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const userId = sessionManager.getUserId();
  const userName = sessionManager.getFullName();
  const grade = sessionManager.getGrade();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progData, challengeData, leaderboardData] = await Promise.all([
          api.getProgress(userId),
          api.getChallenge(grade),
          api.getLeaderboard(grade)
        ]);
        
        setProgress(progData);
        setChallenge(challengeData);

        // Store server-calculated streak for use across the app
        if (progData && progData.streak !== undefined) {
          sessionManager.setServerStreak(progData.streak);
        }
        
        // Calculate rank from leaderboard
        if (leaderboardData && Array.isArray(leaderboardData)) {
          const userRankIndex = leaderboardData.findIndex(s => s.id === userId);
          if (userRankIndex !== -1) {
            setRank(`${userRankIndex + 1}${getOrdinal(userRankIndex + 1)}`);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, grade]);

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return (s[(v - 20) % 10] || s[v] || s[0]);
  };



  const streakCount = sessionManager.getStreakCount();
  
  // Badge calculation logic matching RewardsPage
  const getBadgeCount = () => {
    if (!progress) return 0;
    const globalCount = [
      (progress.quiz_count || 0) >= 10,
      (progress.high_accuracy_quizzes || 0) >= 5,
      (progress.perfect_quizzes || 0) >= 1,
      (progress.quiz_count || 0) > 0,
      streakCount >= 7,
      false // Top of class
    ].filter(Boolean).length;

    let subCount = 0;
    if (progress.earned_badges) {
      Object.values(progress.earned_badges).forEach(chMap => {
        subCount += Object.keys(chMap).length;
      });
    }
    return globalCount + subCount;
  };

  const totalBadges = getBadgeCount();

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-grid">
        {/* Main Content Column */}
        <div className="dashboard-main-col">
          {/* Profile Card */}
          <div className="vq-card animate-fade profile-card-new">
            <div className="profile-info-row">
              <div className="avatar-large">
                {userName.charAt(0)}
              </div>
              <div className="profile-text">
                <p className="greeting">Good Day,</p>
                <h2 className="user-display-name">{userName}</h2>
                <div className="id-badge">ID: {userId}</div>
              </div>
              <div className="streak-display">
                <span className="streak-value">{streakCount}</span>
                <span className="streak-icon">🔥</span>
              </div>
            </div>
            
            <div className="progress-section">
              <div className="progress-labels">
                <span className="progress-title">Your Learning Progress</span>
                <span className="xp-value">{progress?.total_xp || 0} / 5,000 XP</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${Math.min(((progress?.total_xp || 0) / 5000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="dashboard-row-2">
            {/* Daily Challenge */}
            {challenge && (
              <div className="vq-card animate-fade challenge-card" onClick={() => navigate('/challenge')}>
                <div className="challenge-icon-box">⚡</div>
                <div className="challenge-details">
                  <p className="challenge-label">Daily Challenge</p>
                  <h4 className="challenge-title">{challenge.title}</h4>
                  <p className="challenge-hint">Complete for 100 bonus XP!</p>
                </div>
                <div className="challenge-book-icon">📖</div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="stats-inner-grid">
              {[
                { label: 'Badges', value: totalBadges, icon: '🎖️', bg: '#FFF9C4', iconColor: '#FBC02D' },
                { label: 'Class Rank', value: rank, icon: '⚡', bg: '#F3E5F5', iconColor: '#9C27B0' },
                { label: 'Accuracy', value: (progress?.average_accuracy || 0) + '%', icon: '🎯', bg: '#E3F2FD', iconColor: '#2196F3' }
              ].map((stat, i) => (
                <div key={i} className="vq-card animate-fade stat-mini-card">
                  <div className="stat-icon-circle" style={{ background: stat.bg }}>{stat.icon}</div>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Learning */}
          <div className="learning-section">
            <div className="section-header">
              <h3 className="section-title">Continue Learning</h3>
              <span className="see-all" onClick={() => navigate('/subjects')}>See All</span>
            </div>
            <div className="learning-cards-container">
              {progress?.recent_subjects && progress.recent_subjects.length > 0 ? (
                progress.recent_subjects.slice(0, 2).map((subj, i) => (
                  <div key={i} className="vq-card animate-fade learning-card" onClick={() => navigate('/subjects')}>
                    <div className="subject-icon-box">
                      {['📐', '🧪', '📖', '🌍', '📝', '🔤'][i % 6]}
                    </div>
                    <div className="subject-info">
                      <h4 className="subject-name">{subj.subject || subj.name}</h4>
                      <p className="chapter-name">Continuing: {subj.chapter || 'Latest Lesson'}</p>
                      <div className="mini-progress">
                        <div className="mini-bar">
                          <div className="mini-fill" style={{ width: `${subj.progress || 0}%` }}></div>
                        </div>
                        <span className="mini-percent">{subj.progress || 0}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="vq-card animate-fade learning-card empty" onClick={() => navigate('/subjects')}>
                  <div className="subject-icon-box">📚</div>
                  <div className="subject-info">
                    <h4 className="subject-name">Start Learning</h4>
                    <p className="chapter-name">Browse your Grade {grade} subjects</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar/Achievements Column (Desktop Only) */}
        <div className="dashboard-side-col">
          <div className="vq-card achievements-card animate-fade">
            <div className="section-header">
              <h3 className="section-title">Achievements</h3>
              <span className="see-all" onClick={() => navigate('/rewards')}>View All</span>
            </div>
            <div className="achievements-list">
              {[
                { name: 'Quick Learner', icon: '⭐', bg: '#FFF9C4' },
                { name: 'Quiz Master', icon: '🏆', bg: '#FFF9C4' },
                { name: 'Perfect Score', icon: '🎯', bg: '#E8F5E9' },
                { name: 'Bookworm', icon: '📖', bg: '#E8F5E9' },
                { name: '7 Day Streak', icon: '🔥', bg: '#FFEBEE' }
              ].map((ach, i) => (
                <div key={i} className="achievement-item">
                  <div className="ach-icon-box" style={{ background: ach.bg }}>{ach.icon}</div>
                  <span className="ach-name">{ach.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="vq-card chatbot-promo animate-fade">
            <div className="promo-icon">🤖</div>
            <h4>Quick Help?</h4>
            <p>Ask our AI tutor anything about your lessons.</p>
            <button className="vq-button btn-primary" onClick={() => navigate('/chatbot')}>Chat Now</button>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-wrapper {
          padding-bottom: 24px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: start;
        }

        .dashboard-main-col {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .dashboard-side-col {
          display: flex;
          flex-direction: column;
          gap: 32px;
          position: sticky;
          top: 112px;
        }

        .profile-card-new {
          background: linear-gradient(135deg, var(--bg-white) 0%, var(--green-bg) 100%);
          border: none;
          box-shadow: var(--shadow-md);
        }

        .profile-info-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .avatar-large {
          width: 80px;
          height: 80px;
          background: var(--blue-primary);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: white;
          font-weight: 800;
          box-shadow: 0 8px 20px rgba(21, 101, 192, 0.2);
        }

        .profile-text {
          flex: 1;
        }

        .greeting {
          margin: 0;
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .user-display-name {
          margin: 4px 0;
          font-size: 28px;
          font-weight: 800;
          color: var(--text-main);
        }

        .id-badge {
          display: inline-block;
          background: rgba(33, 150, 243, 0.1);
          color: var(--blue-primary);
          padding: 4px 12px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
        }

        .streak-display {
          text-align: right;
          background: var(--bg-white);
          padding: 12px 20px;
          border-radius: 20px;
          box-shadow: var(--shadow-sm);
        }

        .streak-value {
          font-size: 24px;
          font-weight: 900;
          color: #FF7043;
          margin-right: 8px;
        }

        .streak-icon {
          font-size: 28px;
        }

        .progress-section {
          background: var(--bg-white);
          padding: 24px;
          border-radius: 20px;
          box-shadow: var(--shadow-sm);
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .progress-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .xp-value {
          font-size: 14px;
          font-weight: 800;
          color: var(--green-primary);
        }

        .progress-bar-container {
          height: 12px;
          background: var(--bg-app);
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--green-primary);
          border-radius: 6px;
          transition: width 1s ease-out;
        }

        .dashboard-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .challenge-card {
          border: 2px solid var(--orange-primary);
          background: var(--orange-bg);
          display: flex;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .challenge-card:hover {
          transform: translateY(-4px);
        }

        .challenge-icon-box {
          width: 56px;
          height: 56px;
          background: var(--orange-primary);
          color: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .challenge-label {
          margin: 0;
          font-size: 12px;
          font-weight: 800;
          color: #E65100;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .challenge-title {
          margin: 4px 0;
          font-size: 18px;
        }

        .challenge-hint {
          margin: 0;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .stats-inner-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .stat-mini-card {
          text-align: center;
          padding: 16px 8px;
        }

        .stat-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          font-size: 20px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 800;
          margin: 0;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          margin: 0;
          text-transform: uppercase;
        }

        .learning-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
        }

        .see-all {
          color: var(--green-primary);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
        }

        .learning-cards-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .learning-card {
          display: flex;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .learning-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .subject-icon-box {
          width: 64px;
          height: 64px;
          background: var(--bg-app);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .subject-info {
          flex: 1;
        }

        .subject-name {
          margin: 0;
          font-size: 18px;
        }

        .chapter-name {
          margin: 4px 0 12px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .mini-progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mini-bar {
          flex: 1;
          height: 6px;
          background: var(--bg-app);
          border-radius: 3px;
        }

        .mini-fill {
          height: 100%;
          background: var(--blue-primary);
          border-radius: 3px;
        }

        .mini-percent {
          font-size: 12px;
          font-weight: 800;
          color: var(--blue-primary);
        }

        .achievements-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }

        .achievement-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ach-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          border: 1px solid var(--border-light);
        }

        .ach-name {
          font-size: 14px;
          font-weight: 600;
        }

        .chatbot-promo {
          background: var(--green-primary);
          color: white;
          text-align: center;
          padding: 32px 24px;
        }

        .chatbot-promo h4 {
          margin: 12px 0 8px;
          font-size: 20px;
        }

        .chatbot-promo p {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 24px;
        }

        .promo-icon {
          font-size: 40px;
        }

        .chatbot-promo .vq-button {
          background: white;
          color: var(--green-primary);
          max-width: none;
        }

        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-side-col {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .dashboard-row-2, .learning-cards-container {
            grid-template-columns: 1fr;
          }
          .user-display-name {
            font-size: 22px;
          }
          .avatar-large {
            width: 64px;
            height: 64px;
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
