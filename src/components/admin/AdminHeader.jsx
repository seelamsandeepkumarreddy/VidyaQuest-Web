import React from 'react';
import { useLocation } from 'react-router-dom';
import { sessionManager } from '../../utils/session';

const AdminHeader = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('users')) return 'User Directory';
    if (path.includes('announcements')) return 'Global Broadcasts';
    if (path.includes('analytics')) return 'System Intelligence';
    if (path.includes('settings')) return 'Control Panel';
    return 'Console Home';
  };

  return (
    <header className="admin-header-web">
      <div className="header-left-admin">
        <h1 className="header-title-admin">{getPageTitle()}</h1>
        <p className="header-subtitle-admin">Management & Oversight Console</p>
      </div>

      <div className="header-right-admin">
        <div className="admin-badge">Admin Priority Access</div>
        <div className="admin-user-bubble">
           {sessionManager.getFullName()?.charAt(0)}
        </div>
      </div>

      <style>{`
        .admin-header-web {
          padding: 24px 40px;
          background: white;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-title-admin { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
        .header-subtitle-admin { font-size: 13px; color: #64748b; font-weight: 600; margin: 4px 0 0; }

        .header-right-admin { display: flex; align-items: center; gap: 20px; }

        .admin-badge {
          background: #eff6ff;
          color: #3b82f6;
          font-size: 11px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-user-bubble {
          width: 44px;
          height: 44px;
          background: #0f172a;
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .admin-header-web { padding: 16px 24px; }
          .admin-badge { display: none; }
        }
      `}</style>
    </header>
  );
};

export default AdminHeader;
