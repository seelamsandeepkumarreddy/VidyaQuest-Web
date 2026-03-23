import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { sessionManager } from '../../utils/session';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const user = sessionManager.getUser();

  const navLinks = [
    { name: 'Console Home', path: '/admin/dashboard', icon: '🏠' },
    { name: 'User Directory', path: '/admin/users', icon: '👥' },
    { name: 'Broadcasts', path: '/admin/announcements', icon: '📢' },
    { name: 'System Analytics', path: '/admin/analytics', icon: '📊' },
    { name: 'Control Panel', path: '/admin/settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    sessionManager.logout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon-admin">A</div>
        <span className="logo-text">Vidya Admin</span>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `nav-item-admin ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer-admin">
        <div className="admin-profile-mini">
          <div className="admin-avatar-small">
            {sessionManager.getFullName()?.charAt(0)}
          </div>
          <div className="admin-info-text">
            <p className="admin-name-small">{sessionManager.getFullName()}</p>
            <p className="admin-role-small">Chief Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button-admin">
          <span>Sign Out</span>
        </button>
      </div>

      <style>{`
        .admin-sidebar {
          width: 280px;
          height: 100vh;
          background: #0f172a; /* Slate 900 */
          color: white;
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

        .logo-icon-admin {
          width: 40px;
          height: 40px;
          background: #3b82f6;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 12px;
        }

        .nav-item-admin {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 12px;
          text-decoration: none;
          color: #94a3b8;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.2s;
        }

        .nav-item-admin:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .nav-item-admin.active {
          background: #1e293b;
          color: #3b82f6;
          box-shadow: inset 4px 0 0 #3b82f6;
        }

        .nav-icon { font-size: 18px; }

        .sidebar-footer-admin {
          padding: 24px 16px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin-top: auto;
        }

        .admin-profile-mini {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          margin-bottom: 12px;
        }

        .admin-avatar-small {
          width: 38px;
          height: 38px;
          background: #3b82f6;
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .admin-info-text { display: flex; flex-direction: column; }
        .admin-name-small { margin: 0; font-size: 14px; font-weight: 700; line-height: 1.2; }
        .admin-role-small { margin: 4px 0 0; font-size: 11px; color: #64748b; font-weight: 600; }

        .logout-button-admin {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #ef4444;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .logout-button-admin:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
        }

        @media (max-width: 1024px) {
          .admin-sidebar { display: none; }
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;
