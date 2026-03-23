import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sessionManager } from '../../utils/session';

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = sessionManager.getFullName();

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'My Subjects', icon: '📚', path: '/subjects' },
    { name: 'Leaderboard', icon: '⚡', path: '/leaderboard' },
    { name: 'Rewards', icon: '🏆', path: '/rewards' },
    { name: 'Reports', icon: '📊', path: '/reports' },
    { name: 'Notifications', icon: '🔔', path: '/notifications' },
    { name: 'Profile', icon: '👤', path: '/profile' },
    { name: 'AI Tutor', icon: '💬', path: '/chatbot' },
  ];

  const handleLogout = () => {
    sessionManager.logout();
    navigate('/login');
  };

  return (
    <aside className="student-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">📖</div>
          <span className="logo-text">VidyaQuest</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.name}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-brief">
          <div className="avatar-small">{userName.charAt(0)}</div>
          <div className="user-details">
            <p className="user-name">{userName}</p>
            <p className="user-role">Student</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Logout</span>
        </button>
      </div>

      <style>{`
        .student-sidebar {
          width: 280px;
          height: 100vh;
          background: white;
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .sidebar-header {
          padding: 32px 24px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: var(--green-primary);
          border-radius: 12px;
          display: flex;
          alignItems: center;
          justifyContent: center;
          font-size: 22px;
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 800;
          color: var(--green-primary);
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .nav-item:hover {
          background: var(--green-bg);
          color: var(--green-primary);
          transform: translateX(4px);
        }

        .nav-item.active {
          background: var(--green-primary);
          color: white;
          box-shadow: 0 8px 16px rgba(46, 125, 50, 0.15);
        }

        .nav-icon {
          font-size: 20px;
        }

        .nav-text {
          font-size: 15px;
        }

        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .user-brief {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-small {
          width: 40px;
          height: 40px;
          background: var(--blue-bg);
          color: var(--blue-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 16px;
        }

        .user-name {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-main);
        }

        .user-role {
          margin: 0;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid #fee2e2;
          background: #fff5f5;
          color: var(--red-primary);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #fee2e2;
          transform: translateY(-2px);
        }

        @media (max-width: 991px) {
          .student-sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};

export default StudentSidebar;
