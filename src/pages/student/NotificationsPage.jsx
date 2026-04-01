import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';
import BottomNav from '../../components/BottomNav';

const NotificationsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState(sessionManager.getReadNotificationIds());
  
  const userId = sessionManager.getUserId();
  const grade = sessionManager.getGrade();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await api.getAnnouncements(grade, userId, 'student');
        setAnnouncements(data);
        
        // Mark all as read after viewing (with a slight delay for UX)
        setTimeout(() => {
          if (Array.isArray(data) && data.length > 0) {
            const ids = data.map(a => a.id).filter(Boolean);
            sessionManager.markNotificationsRead(ids);
            setReadIds(sessionManager.getReadNotificationIds());
          }
        }, 2000);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [userId, grade]);

  const isUnread = (id) => !readIds.includes(id);
  const unreadCount = announcements.filter(a => isUnread(a.id)).length;

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 className="text-headline" style={{ margin: 0 }}>Announcements</h2>
              {unreadCount > 0 && (
                <span className="unread-count-badge">{unreadCount} new</span>
              )}
            </div>
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
            {announcements.length > 0 ? announcements.map((ann, i) => {
              const unread = isUnread(ann.id);
              return (
                <div 
                  key={ann.id} 
                  className={`vq-card animate-fade notification-card ${unread ? 'notification-unread' : ''}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                {unread && <div className="unread-dot"></div>}
                <div className="notification-icon-box">
                  📢
                </div>
                <div className="notification-content">
                  <div className="notification-head">
                    <h4 className="notification-title">{ann.title}</h4>
                    <span className="notification-time">{unread ? 'New' : 'Read'}</span>
                  </div>
                  <p className="notification-message">{ann.message}</p>
                </div>
              </div>
              );
            }) : (
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

        .back-button-circle:hover {
          transform: translateX(-4px);
          border-color: var(--green-primary);
          color: var(--green-primary);
        }

        .unread-count-badge {
          background: #ef4444;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          animation: pulse-badge 2s infinite;
        }

        @keyframes pulse-badge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
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
          position: relative;
        }

        .notification-unread {
          border-left: 4px solid #3b82f6 !important;
          background: #f8faff !important;
        }

        .unread-dot {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 10px;
          height: 10px;
          background: #3b82f6;
          border-radius: 50%;
          animation: pulse-dot 1.5s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
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

        .notification-unread .notification-time {
          background: #dbeafe;
          color: #1d4ed8;
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
