import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../../utils/session';

const StudentHeader = () => {
  const navigate = useNavigate();
  const userName = sessionManager.getFullName();
  const grade = sessionManager.getGrade();

  return (
    <header className="student-header">
      <div className="header-left">
        <h2 className="header-title">Welcome back, {userName.split(' ')[0]}! 👋</h2>
        <p className="header-subtitle">Your Grade {grade} Learning Journey</p>
      </div>

      <div className="header-right">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search lessons, quizzes..." />
        </div>

        <div className="header-actions">
          <div className="action-item" onClick={() => navigate('/notifications')} title="Notifications">
            <span className="action-icon">🔔</span>
            <span className="badge">3</span>
          </div>
          <div className="action-item" onClick={() => navigate('/chatbot')} title="AI Assistant">
            <span className="action-icon">🤖</span>
          </div>
          <div className="user-profile-header" onClick={() => navigate('/profile')}>
            <div className="avatar-header">{userName.charAt(0)}</div>
          </div>
        </div>
      </div>

      <style>{`
        .student-header {
          height: 80px;
          background: var(--bg-white);
          border-bottom: 1px solid var(--border-light);
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-left {
          display: flex;
          flex-direction: column;
        }

        .header-title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
        }

        .header-subtitle {
          margin: 0;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: var(--bg-app);
          padding: 10px 16px;
          border-radius: 12px;
          gap: 12px;
          width: 320px;
          transition: all 0.2s;
        }

        .search-bar:focus-within {
          background: var(--bg-white);
          box-shadow: 0 0 0 2px var(--green-primary);
        }

        .search-bar input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 14px;
          color: var(--text-main);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .action-item {
          width: 44px;
          height: 44px;
          background: var(--bg-app);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .action-item:hover {
          background: var(--green-bg);
          color: var(--green-primary);
          transform: translateY(-2px);
        }

        .action-icon {
          font-size: 20px;
        }

        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--red-primary);
          color: white;
          font-size: 10px;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-white);
        }

        .user-profile-header {
          cursor: pointer;
          padding: 2px;
          border-radius: 50%;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }

        .user-profile-header:hover {
          border-color: var(--green-primary);
        }

        .avatar-header {
          width: 44px;
          height: 44px;
          background: var(--blue-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
        }

        @media (max-width: 991px) {
          .student-header {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default StudentHeader;
