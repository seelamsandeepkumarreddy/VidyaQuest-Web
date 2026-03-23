import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';
import BottomNav from '../../components/BottomNav';

const ReportsPage = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const userId = sessionManager.getUserId();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await api.getProgress(userId);
        setProgress(data);
      } catch (err) {
        console.error('Failed to fetch reports info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [userId]);

  const stats = [
    { label: 'Total XP', value: progress?.total_xp || 0, icon: '📈', color: '#4CAF50', bg: '#E8F5E9' },
    { label: 'Weekly XP', value: progress?.weekly_xp || 0, icon: '🔥', color: '#FF9800', bg: '#FFF3E0' },
    { label: 'Study Time', value: (progress?.total_study_time || 0) + ' min', icon: '⏱️', color: '#2196F3', bg: '#E3F2FD' },
    { label: 'Avg Accuracy', value: (progress?.average_accuracy || 0) + '%', icon: '🎯', color: '#9C27B0', bg: '#F3E5F5' },
  ];

  // Helper to get subject performance from completed_chapters
  const getSubjectProgress = () => {
    const chapters = progress?.completed_chapters || {};
    const subjects = ['Mathematics', 'Science', 'Social Studies', 'English'];
    const colors = ['#1565C0', '#2E7D32', '#EF6C00', '#7B1FA2'];
    
    return subjects.map((name, i) => {
      // Find key matching grade-subject (e.g., "8-Math")
      // This is a rough estimation of progress
      const matchKey = Object.keys(chapters).find(k => k.toLowerCase().includes(name.substring(0, 4).toLowerCase()));
      const completedCount = matchKey ? chapters[matchKey].length : 0;
      
      // Use real chapter counts from backend if available
      const totalChapters = progress?.subject_chapter_counts?.[name] || 10;
      const percentage = Math.min(Math.round((completedCount / totalChapters) * 100), 100);
      
      return {
        name,
        percentage: percentage,
        color: colors[i]
      };
    });
  };

  const badges = progress?.earned_badges ? Object.entries(progress.earned_badges).flatMap(([subject, chapters]) => 
    Object.entries(chapters).map(([chapter, type]) => ({ subject, chapter, type }))
  ) : [];

  return (
    <div className="reports-wrapper">
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h2 className="text-headline" style={{ textAlign: 'center' }}>Learning Analytics</h2>
        <p className="text-secondary" style={{ textAlign: 'center', marginTop: '8px' }}>Tracking your progress and academic performance</p>
      </div>

      <div className="reports-container-layout">
        <div className="stats-hero-grid">
          {stats.map((stat, i) => (
            <div key={i} className="vq-card stat-hero-card animate-fade" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-icon-circle" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</div>
              <div className="stat-info-content">
                <div className="stat-hero-value" style={{ color: stat.color }}>{stat.value}</div>
                <div className="stat-hero-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="reports-performance-grid">
          {/* Performance Chart */}
          <div className="vq-card performance-card animate-fade" style={{ animationDelay: '0.4s' }}>
            <h3 className="card-title-lg">Subject Mastery</h3>
            <div className="subject-progress-list">
              {getSubjectProgress().map((subj, i) => (
                <div key={i} className="subject-mastery-item">
                  <div className="subject-info-row">
                    <span className="subject-name-text">{subj.name}</span>
                    <span className="subject-percent-text" style={{ color: subj.color }}>{subj.percentage}% Mastery</span>
                  </div>
                  <div className="mastery-track">
                    <div className="mastery-fill" style={{ width: `${subj.percentage}%`, background: subj.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Earned Badges */}
          <div className="vq-card reports-badges-card animate-fade" style={{ animationDelay: '0.5s' }}>
             <h3 className="card-title-lg">Recent Achievements</h3>
             <div className="badges-report-container">
               {badges.length > 0 ? (
                 <div className="badges-report-grid">
                   {badges.slice(0, 8).map((badge, i) => (
                     <div key={i} className="report-badge-item">
                       <div className="badge-type-icon">{badge.type === 'Gold' ? '🥇' : badge.type === 'Silver' ? '🥈' : '🥉'}</div>
                       <div className="badge-meta-content">
                         <div className="badge-subject-name">{badge.subject}</div>
                         <div className="badge-chapter-name">{badge.chapter}</div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="empty-badges-report">
                   <div className="empty-icon-box">🎖️</div>
                   <p>No badges earned yet. Complete quizzes with high accuracy to earn them!</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .reports-wrapper {
          padding-top: 20px;
        }

        .reports-container-layout {
          max-width: 1200px;
          margin: 0 auto 100px;
        }

        .stats-hero-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-hero-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 32px !important;
          transition: transform 0.2s ease;
        }

        .stat-hero-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }

        .stat-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
        }

        .stat-hero-value {
          font-size: 28px;
          font-weight: 900;
          line-height: 1;
        }

        .stat-hero-label {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 700;
          margin-top: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .reports-performance-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 32px;
        }

        .card-title-lg {
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 32px;
          color: var(--text-main);
        }

        .subject-progress-list {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .subject-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .subject-name-text {
          font-size: 16px;
          font-weight: 800;
        }

        .subject-percent-text {
          font-size: 16px;
          font-weight: 900;
        }

        .mastery-track {
          height: 14px;
          background: #f1f5f9;
          border-radius: 7px;
          overflow: hidden;
        }

        .mastery-fill {
          height: 100%;
          border-radius: 7px;
          transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .badges-report-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .report-badge-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #f8fafc;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .report-badge-item:hover {
          background: white;
          border-color: #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .badge-type-icon {
          font-size: 28px;
        }

        .badge-subject-name {
          font-weight: 800;
          font-size: 14px;
        }

        .badge-chapter-name {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .empty-badges-report {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }

        .empty-icon-box {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.3;
        }

        @media (max-width: 1024px) {
          .stats-hero-grid { grid-template-columns: repeat(2, 1fr); }
          .reports-performance-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .stats-hero-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default ReportsPage;
