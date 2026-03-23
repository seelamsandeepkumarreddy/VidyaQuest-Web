import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import StudentHeader from './StudentHeader';
import BottomNav from '../BottomNav';

const StudentLayout = () => {
  return (
    <div className="layout-wrapper">
      {/* Sidebar for Desktop */}
      <StudentSidebar />

      <div className="content-area">
        {/* Header for Desktop */}
        <StudentHeader />

        {/* Dynamic Page Content */}
        <main className="main-viewport">
          <Outlet />
        </main>

        {/* Bottom Nav for Mobile */}
        <div className="mobile-only-nav">
          <BottomNav />
        </div>
      </div>

      <style>{`
        .layout-wrapper {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0; /* Prevents flex children from overflowing */
        }

        .main-viewport {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        .mobile-only-nav {
          display: none;
        }

        @media (max-width: 991px) {
          .main-viewport {
            padding: 20px;
            padding-bottom: 100px; /* Space for BottomNav */
          }
          
          .mobile-only-nav {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentLayout;
