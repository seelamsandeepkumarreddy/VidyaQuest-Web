import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';
import BottomNav from '../../components/BottomNav';

const ProfilePage = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const userId = sessionManager.getUserId();
  const user = sessionManager.getUser();
  const userName = user?.full_name || 'Student';
  const schoolName = user?.school_name || 'Quest Academy';
  const grade = user?.grade || '8';
  const streakCount = sessionManager.getStreakCount();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await api.getProgress(userId);
        setProgress(data);
      } catch (err) {
        console.error('Failed to fetch profile info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [userId]);

  // Calculations matching Android ProfileScreen.kt
  const totalXp = progress?.total_xp || 0;
  const maxXp = 3000;
  const level = 1 + Math.floor(totalXp / 500);
  const xpProgress = Math.min((totalXp / maxXp) * 100, 100);
  const xpRemaining = Math.max(0, maxXp - totalXp);

  // Lessons completed for current grade
  const lessonCount = progress?.completed_chapters 
    ? Object.entries(progress.completed_chapters)
        .filter(([key]) => key.startsWith(`${grade}-`))
        .reduce((sum, [_, list]) => sum + list.length, 0)
    : 0;

  // Badge count logic (Sync with RewardsPage)
  const getBadgeData = () => {
    if (!progress) return { count: 0, list: [] };
    const globalList = [
      { name: 'Quick Learner', unlocked: (progress.quiz_count || 0) >= 10, icon: '⭐', color: '#FBC02D' },
      { name: 'Quiz Master', unlocked: (progress.high_accuracy_quizzes || 0) >= 5, icon: '🏆', color: '#FFA000' },
      { name: 'Perfect Score', unlocked: (progress.perfect_quizzes || 0) >= 1, icon: '🎯', color: '#4DB6AC' },
      { name: 'Bookworm', unlocked: (progress.quiz_count || 0) > 0, icon: '📖', color: '#81C784' },
      { name: '7 Day Streak', unlocked: streakCount >= 7, icon: '🔥', color: '#FF7043' }
    ].filter(b => b.unlocked);

    const subjectList = [];
    if (progress.earned_badges) {
      Object.entries(progress.earned_badges).forEach(([subject, chMap]) => {
        Object.entries(chMap).forEach(([chapter, type]) => {
          let color = '#FFD700';
          if (type === 'Silver') color = '#C0C0C0';
          if (type === 'Bronze') color = '#CD7F32';
          subjectList.push({ name: `${chapter}`, icon: '🏆', color });
        });
      });
    }

    const combined = [...globalList, ...subjectList];
    return { count: combined.length, list: combined };
  };

  const badgeData = getBadgeData();

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div className="profile-wrapper">
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate(-1)} 
            className="back-button-circle"
          >
            ←
          </button>
          <h2 className="text-headline" style={{ margin: 0 }}>Profile & Settings</h2>
        </div>
      </div>

      <div className="profile-container-layout">
        <div className="profile-grid">
          
          {/* Left Column: User Info & Stats */}
          <div className="profile-main-col">
            <div className="vq-card profile-info-card animate-fade">
              <div className="profile-avatar-large">
                {userName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="profile-details-text">
                <h2 className="user-full-name">{userName}</h2>
                <p className="user-school-meta">Grade {grade} Student • {schoolName}</p>
                <div className="user-id-tag">ID: {userId}</div>
              </div>

              <div className="profile-stats-row">
                <div className="stat-box">
                  <span className="stat-icon">🔥</span>
                  <div className="stat-value">{streakCount}</div>
                  <div className="stat-label">Day Streak</div>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">🎖️</span>
                  <div className="stat-value">{badgeData.count}</div>
                  <div className="stat-label">Badges</div>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">📖</span>
                  <div className="stat-value">{lessonCount}</div>
                  <div className="stat-label">Lessons</div>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="vq-card level-progress-card animate-fade" style={{ animationDelay: '0.1s' }}>
              <div className="level-badge">{level}</div>
              <div className="level-info-content">
                <div className="level-header-row">
                  <span className="level-title-text">Level {level} Milestone</span>
                  <span className="xp-fraction-text">{totalXp.toLocaleString()} / {maxXp.toLocaleString()} XP</span>
                </div>
                <div className="main-xp-track">
                  <div className="main-xp-fill" style={{ width: `${xpProgress}%` }}></div>
                </div>
                <p className="xp-remaining-text">{xpRemaining.toLocaleString()} XP remaining for next level up</p>
              </div>
            </div>

            {/* Badges Preview */}
            <div className="vq-card profile-badges-preview animate-fade" style={{ animationDelay: '0.2s' }}>
              <div className="card-header-between">
                <h3 className="card-title-sm">Recent Achievements</h3>
                <button onClick={() => navigate('/rewards')} className="btn-link-green">View Gallery</button>
              </div>
              <div className="badge-preview-horizontal">
                {badgeData.list.length > 0 ? badgeData.list.slice(0, 6).map((badge, i) => (
                  <div key={i} className="mini-badge-item" title={badge.name}>
                    <div className="mini-badge-icon" style={{ background: `${badge.color}15`, color: badge.color, border: `1px solid ${badge.color}30` }}>
                      {badge.icon}
                    </div>
                    <span className="mini-badge-name">{badge.name}</span>
                  </div>
                )) : (
                  <p className="no-data-text">Your trophy room is empty. Start learning to earn badges!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Settings Actions */}
          <div className="profile-settings-col">
            <div className="settings-list-enhanced animate-fade" style={{ animationDelay: '0.3s' }}>
              <h3 className="settings-section-title">Account Settings</h3>
              
              <div className="settings-action-card" onClick={() => navigate('/forgot-password')}>
                <div className="action-icon-box key-icon">🔑</div>
                <div className="action-label">Security & Password</div>
                <div className="action-arrow">→</div>
              </div>

              <div className="settings-toggle-card">
                <div className="action-icon-box bell-icon">🔔</div>
                <div className="action-label">Push Notifications</div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="settings-toggle-card">
                <div className="action-icon-box moon-icon">🌙</div>
                <div className="action-label">Dark Interface</div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="settings-action-card logout-action" onClick={() => sessionManager.logout()}>
                <div className="action-icon-box door-icon">🚪</div>
                <div className="action-label">Sign Out</div>
                <div className="action-arrow">→</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .profile-wrapper {
          padding-top: 20px;
        }

        .back-button-circle {
          background: white;
          border: 1px solid #e2e8h0;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          font-size: 20px;
          transition: all 0.2s ease;
        }

        .profile-container-layout {
          max-width: 1100px;
          margin: 0 auto 100px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 32px;
        }

        .profile-info-card {
          padding: 48px !important;
          text-align: center;
          margin-bottom: 24px;
          background: linear-gradient(to bottom, white 0%, #f8fafc 100%);
        }

        .profile-avatar-large {
          width: 120px;
          height: 120px;
          background: var(--blue-primary);
          color: white;
          border-radius: 40px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 900;
          box-shadow: 0 15px 30px rgba(33, 150, 243, 0.2);
        }

        .user-full-name {
          font-size: 28px;
          margin: 0 0 8px;
          font-weight: 800;
        }

        .user-school-meta {
          font-size: 16px;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .user-id-tag {
          display: inline-block;
          background: #e1f5fe;
          color: #0288d1;
          padding: 6px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
        }

        .profile-stats-row {
          display: flex;
          justify-content: center;
          gap: 48px;
          margin-top: 40px;
          border-top: 1px solid #f1f5f9;
          padding-top: 32px;
        }

        .stat-box {
          text-align: center;
        }

        .stat-icon {
          font-size: 24px;
          display: block;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 900;
          color: var(--text-main);
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 700;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .level-progress-card {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 32px !important;
          margin-bottom: 24px;
        }

        .level-badge {
          width: 72px;
          height: 72px;
          background: var(--green-primary);
          color: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 900;
          flex-shrink: 0;
          box-shadow: 0 10px 20px rgba(46, 125, 50, 0.2);
        }

        .level-info-content {
          flex: 1;
        }

        .level-header-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .level-title-text {
          font-size: 18px;
          font-weight: 800;
        }

        .xp-fraction-text {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .main-xp-track {
          height: 12px;
          background: #f1f5f9;
          border-radius: 6px;
          overflow: hidden;
        }

        .main-xp-fill {
          height: 100%;
          background: var(--green-primary);
          border-radius: 6px;
          transition: width 0.6s ease;
        }

        .xp-remaining-text {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 12px;
          font-weight: 600;
        }

        .profile-badges-preview {
          padding: 32px !important;
        }

        .card-header-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .card-title-sm {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
        }

        .btn-link-green {
          background: none;
          border: none;
          color: var(--green-primary);
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .badge-preview-horizontal {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .mini-badge-item {
          text-align: center;
          min-width: 80px;
        }

        .mini-badge-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 12px;
        }

        .mini-badge-name {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .settings-list-enhanced {
          background: white;
          border-radius: 32px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
          border: 1px solid #f1f5f9;
        }

        .settings-section-title {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 24px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .settings-action-card, .settings-toggle-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px;
          border-radius: 20px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
          cursor: pointer;
          background: #f8fafc;
        }

        .settings-action-card:hover {
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transform: translateX(4px);
        }

        .action-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .key-icon { background: #e8eaf6; color: #3f51b5; }
        .bell-icon { background: #e1f5fe; color: #03a9f4; }
        .moon-icon { background: #f3e5f5; color: #9c27b0; }
        .door-icon { background: #ffebee; color: #f44336; }

        .action-label {
          flex: 1;
          font-weight: 700;
          font-size: 16px;
          color: var(--text-main);
        }

        .logout-action .action-label { color: #f44336; }

        .action-arrow {
          color: #cbd5e1;
          font-size: 18px;
        }

        /* Toggle Switch Styling */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider { background-color: var(--green-primary); }
        input:checked + .slider:before { transform: translateX(26px); }

        @media (max-width: 900px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
