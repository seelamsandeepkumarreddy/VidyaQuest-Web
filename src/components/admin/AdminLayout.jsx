import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import BottomNav from '../BottomNav';
import { sessionManager } from '../../utils/session';

const AdminLayout = () => {
  const user = sessionManager.getUser();
  const role = user?.role?.trim().toLowerCase();

  // Protect admin routes
  if (!user || !['admin', 'administrator'].includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout-container">
      <AdminSidebar />
      <div className="admin-main-wrapper">
        <AdminHeader />
        <main className="admin-content-area">
          <Outlet />
        </main>
        {/* Mirror mobile nav behavior for admin if needed, or hide it */}
      </div>
      <div className="mobile-only-nav-admin">
         <BottomNav />
      </div>

      <style>{`
        .admin-layout-container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc; /* Slate 50 */
        }

        .admin-main-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .admin-content-area {
          padding: 40px;
          flex: 1;
        }

        .mobile-only-nav-admin { display: none; }

        @media (max-width: 1024px) {
          .admin-content-area { padding: 24px; }
          .mobile-only-nav-admin { display: block; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
