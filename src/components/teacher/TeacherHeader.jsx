import React from 'react';
import { useLocation } from 'react-router-dom';

const TeacherHeader = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard Overview';
    if (path.includes('students')) return 'Classroom Management';
    if (path.includes('attendance')) return 'Daily Attendance';
    if (path.includes('assignments')) return 'Assignment Hub';
    return 'Teacher Portal';
  };

  return (
    <header className="teacher-header">
      <div className="header-left">
        <h1 className="header-title">{getPageTitle()}</h1>
        <div className="header-breadcrumb">
          <span>Teacher</span>
          <span className="breadcrumb-sep">/</span>
          <span className="current-crumb">{getPageTitle()}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search students, assignments..." className="search-input" />
        </div>
        
        <div className="header-actions">
          <button className="icon-btn-header" title="Notifications">
             <span className="icon">🔔</span>
             <span className="badge-dot"></span>
          </button>
          <button className="icon-btn-header" title="Support AI">
             <span className="icon">🤖</span>
          </button>
        </div>
      </div>

      <style>{`
        .teacher-header {
          height: 80px;
          background: white;
          border-bottom: 1px solid #eef2f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-title {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.5px;
        }

        .header-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
          margin-top: 4px;
        }

        .breadcrumb-sep {
          opacity: 0.5;
        }

        .current-crumb {
          color: var(--green-primary);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .header-search {
          position: relative;
          width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          opacity: 0.5;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 1.5px solid #f1f5f9;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }

        .search-input:focus {
          border-color: var(--green-primary);
          background: white;
          box-shadow: 0 0 0 4px rgba(46, 125, 50, 0.05);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .icon-btn-header {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1.5px solid #f1f5f9;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .icon-btn-header:hover {
          background: #f8fafc;
          border-color: #e2e8f0;
          transform: translateY(-2px);
        }

        .icon {
          font-size: 20px;
        }

        .badge-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
        }

        @media (max-width: 1024px) {
          .teacher-header {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default TeacherHeader;
