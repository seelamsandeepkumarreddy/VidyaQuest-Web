import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { sessionManager } from '../../utils/session';

const TeacherSidebar = () => {
  const navigate = useNavigate();
  const user = sessionManager.getUser();

  const navLinks = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: '📊' },
    { name: 'Students', path: '/teacher/students', icon: '👥' },
    { name: 'Attendance', path: '/teacher/attendance', icon: '📅' },
    { name: 'Assignments', path: '/teacher/assignments', icon: '📝' },
    { name: 'Content Management', path: '/teacher/content', icon: '📚' },
  ];

  const handleLogout = () => {
    sessionManager.logout();
    navigate('/login');
  };

  return (
    <aside className="teacher-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">V</div>
        <span className="logo-text">Vidya Faculty</span>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-mini">
          <div className="user-avatar-small">
            {sessionManager.getFullName()?.charAt(0)}
          </div>
          <div className="user-info-text">
            <p className="user-name-small">{sessionManager.getFullName()}</p>
            <p className="user-role-small">Grade {user?.grade} • {user?.subject_expertise || 'Teacher'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button-sidebar">
          <span className="logout-icon">🚪</span>
          <span>Sign Out</span>
        </button>
      </div>

      <style>{`
        .teacher-sidebar {
          width: 280px;
          height: 100vh;
          background: white;
          border-right: 1px solid #eef2f6;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 24px 0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 24px 32px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: var(--green-primary);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 12px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: #64748b;
          font-weight: 600;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-item:hover {
          background: #f8fafc;
          color: var(--green-primary);
          transform: translateX(4px);
        }

        .nav-item.active {
          background: #f0fdf4;
          color: var(--green-primary);
        }

        .nav-icon {
          font-size: 20px;
        }

        .sidebar-footer {
          padding: 24px 16px 0;
          border-top: 1px solid #f1f5f9;
          margin-top: auto;
        }

        .user-profile-mini {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 16px;
          margin-bottom: 12px;
        }

        .user-avatar-small {
          width: 38px;
          height: 38px;
          background: white;
          color: var(--green-primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          border: 1px solid #eef2f6;
        }

        .user-info-text {
          display: flex;
          flex-direction: column;
        }

        .user-name-small {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }

        .user-role-small {
          margin: 4px 0 0;
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .logout-button-sidebar {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: none;
          border: 1.5px solid #f1f5f9;
          border-radius: 12px;
          cursor: pointer;
          color: #ef4444;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.2s;
        }

        .logout-button-sidebar:hover {
          background: #fef2f2;
          border-color: #fca5a5;
        }

        @media (max-width: 1024px) {
          .teacher-sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};

export default TeacherSidebar;
