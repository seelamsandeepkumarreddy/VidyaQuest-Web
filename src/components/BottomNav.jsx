import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sessionManager } from '../utils/session';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = sessionManager.getUser();
  const userName = user?.full_name || 'User';
  const role = user?.role?.toLowerCase() || 'student';

  const studentTabs = [
    { name: 'Home', icon: '🏠', path: '/dashboard' },
    { name: 'Subjects', icon: '📚', path: '/subjects' },
    { name: 'Rewards', icon: '🏆', path: '/rewards' },
    { name: 'Reports', icon: '📊', path: '/reports' },
    { name: 'Profile', icon: '👤', path: '/profile' }
  ];

  const teacherTabs = [
    { name: 'Home', icon: '🏠', path: '/teacher/dashboard' },
    { name: 'Students', icon: '👥', path: '/teacher/students' },
    { name: 'Attendance', icon: '📅', path: '/teacher/attendance' },
    { name: 'Tasks', icon: '📝', path: '/teacher/assignments' },
    { name: 'Content', icon: '📚', path: '/teacher/content' }
  ];

  const tabs = ['teacher', 'faculty'].includes(role) ? teacherTabs : studentTabs;

  const handleLogout = () => {
    sessionManager.logout();
  };

  return (
    <>
      {/* Top Navbar for Desktop */}
      <nav className="desktop-nav" style={{
        display: 'none',
        position: 'sticky',
        top: 0,
        background: 'white',
        borderBottom: '1px solid var(--border-light)',
        padding: '0 40px',
        height: '72px',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1001,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
           <div style={{ width: '32px', height: '32px', background: 'var(--green-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📖</div>
           <h2 className="text-title" style={{ color: 'var(--green-primary)', margin: 0 }}>VidyaQuest</h2>
        </div>

        <div style={{ display: 'flex', gap: '32px', height: '100%' }}>
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <div 
                key={tab.name}
                onClick={() => navigate(tab.path)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--green-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '3px solid var(--green-primary)' : '3px solid transparent',
                  padding: '0 4px',
                  transition: 'all 0.2s'
                }}
              >
                {tab.name}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right', display: 'none' }} className="user-info-desktop">
             <p style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>{userName}</p>
             <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{role.charAt(0).toUpperCase() + role.slice(1)}</p>
          </div>
          <div style={{ width: '40px', height: '40px', background: 'var(--green-bg)', color: 'var(--green-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
            {userName.charAt(0)}
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--red-primary)', cursor: 'pointer', fontSize: '20px' }} title="Logout">🚪</button>
        </div>
      </nav>

      {/* Bottom Nav for Mobile */}
      <nav className="mobile-nav" style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: 'white', 
        display: 'flex', 
        justifyContent: 'space-around', 
        padding: '12px 6px',
        borderTop: '1px solid var(--border-light)',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
      }}>
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <div 
              key={tab.name}
              onClick={() => navigate(tab.path)}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                cursor: 'pointer',
                flex: 1,
                opacity: isActive ? 1 : 0.4
              }}
            >
              <span style={{ fontSize: '20px', marginBottom: '4px' }}>{tab.icon}</span>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: isActive ? '800' : '500', 
                color: isActive ? 'var(--green-primary)' : 'var(--text-secondary)'
              }}>
                {tab.name}
              </span>
            </div>
          );
        })}
      </nav>
      
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav { display: none !important; }
          .user-info-desktop { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navigation;
