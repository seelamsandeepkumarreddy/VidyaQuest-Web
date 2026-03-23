import React from 'react';
import { Outlet } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import TeacherHeader from './TeacherHeader';
import BottomNav from '../BottomNav';

const TeacherLayout = () => {
  return (
    <div className="teacher-app-layout">
      {/* Desktop Sidebar */}
      <TeacherSidebar />

      <div className="teacher-main-wrapper">
        {/* Desktop Header */}
        <TeacherHeader />

        {/* Dynamic Page Content */}
        <main className="teacher-page-content">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation (Reuse student one or create new if needed) */}
        <div className="mobile-nav-only">
          <BottomNav />
        </div>
      </div>

      <style>{`
        .teacher-app-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .teacher-main-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .teacher-page-content {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .mobile-nav-only {
          display: none;
        }

        @media (max-width: 1024px) {
          .teacher-page-content {
            padding: 24px 16px 100px;
          }
          
          .mobile-nav-only {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherLayout;
