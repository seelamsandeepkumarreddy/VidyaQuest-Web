import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';
import BottomNav from '../../components/BottomNav';

const NotificationsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userId = sessionManager.getUserId();
  const grade = sessionManager.getGrade();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await api.getAnnouncements(grade, userId, 'student');
        setAnnouncements(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [userId, grade]);

  return (
    <div className="notifications-wrapper">
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => window.history.back()} 
            className="back-button-circle"
          >
            ←
          </button>
          <div>
            <h2 className="text-headline" style={{ margin: 0 }}>Announcements</h2>
            <p className="text-secondary" style={{ marginTop: '4px' }}>Stay updated with the latest news from your school</p>
          </div>
        </div>
      </div>

      <div className="notifications-container-layout">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <div className="loader"></div>
            <p>Fetching latest updates...</p>
          </div>
        ) : (
          <div className="notifications-list">
            {announcements.length > 0 ? announcements.map((ann, i) => (
              <div 
                key={ann.id} 
                className="vq-card animate-fade notification-card" 
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="notification-icon-box">
                  📢
                </div>
                <div className="notification-content">
                  <div className="notification-head">
                    <h4 className="notification-title">{ann.title}</h4>
                    <span className="notification-time">Recent Update</span>
                  </div>
                  <p className="notification-message">{ann.message}</p>
                </div>
              </div>
            )) : (
              <div className="vq-card empty-notifications-state animate-fade">
                <div className="empty-icon-large">📭</div>
                <h3 className="empty-title">All caught up!</h3>
                <p className="empty-desc">There are no new notifications for your grade level at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .notifications-wrapper {
          padding-top: 20px;
        }

        .back-button-circle {
          background: white;
          border: 1px solid #e2e8f0;
          borderRadius: 50%;
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

        .back-button-circle:hover {
          transform: translateX(-4px);
          border-color: var(--green-primary);
          color: var(--green-primary);
        }

        .notifications-container-layout {
          max-width: 900px;
          margin: 0 auto 100px;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .notification-card {
          display: flex;
          gap: 32px;
          padding: 40px !important;
          align-items: flex-start;
          transition: transform 0.2s ease;
        }

        .notification-card:hover {
          transform: scale(1.01);
          border-color: var(--blue-primary);
        }

        .notification-icon-box {
          width: 80px;
          height: 80px;
          background: var(--blue-bg);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          flex-shrink: 0;
          color: var(--blue-primary);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .notification-content {
          flex: 1;
        }

        .notification-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .notification-title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
        }

        .notification-time {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 800;
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 12px;
          text-transform: uppercase;
        }

        .notification-message {
          margin: 0;
          font-size: 16px;
          line-height: 1.6;
          color: var(--text-main);
          opacity: 0.8;
        }

        .empty-notifications-state {
          text-align: center;
          padding: 120px 48px !important;
          background: white;
        }

        .empty-icon-large {
          font-size: 100px;
          margin-bottom: 32px;
          opacity: 0.3;
        }

        .empty-title {
          font-size: 24px;
          margin: 0 0 12px;
          font-weight: 800;
          color: var(--text-main);
        }

        .empty-desc {
          font-size: 16px;
          color: var(--text-secondary);
          max-width: 400px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .notification-card {
            flex-direction: column;
            gap: 20px;
            padding: 24px !important;
          }
          .notification-icon-box {
            width: 60px;
            height: 60px;
            font-size: 28px;
          }
          .notification-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
