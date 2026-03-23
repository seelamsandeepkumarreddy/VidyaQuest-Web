import React from 'react';
import { sessionManager } from '../../utils/session';

const AdminSettings = () => {
  const user = sessionManager.getUser();

  return (
    <div className="admin-settings-page animate-fade">
      <div className="settings-hero vq-card">
         <div className="profile-large">
            <div className="avatar-huge">{sessionManager.getFullName()?.charAt(0)}</div>
            <div className="profile-text">
               <h2>{sessionManager.getFullName()}</h2>
               <p>System Administrator Access Level</p>
            </div>
         </div>
      </div>

      <div className="settings-grid">
         <div className="settings-section vq-card">
            <h3>Account Authentication</h3>
            <div className="setting-row">
               <span>Email Address</span>
               <b>{user?.email || 'admin@vidya.edu'}</b>
            </div>
            <div className="setting-row">
               <span>Access Permissions</span>
               <b className="access-high">Site-Wide Master Access</b>
            </div>
            <button className="btn-web-outline">Modify Security Credentials</button>
         </div>

         <div className="settings-section vq-card">
            <h3>Platform Preferences</h3>
            <div className="setting-row">
               <span>System Notifications</span>
               <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
               </label>
            </div>
            <div className="setting-row">
               <span>Auto-Approval of Faculty</span>
               <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
               </label>
            </div>
            <button className="btn-web-primary">Sync System Global Defaults</button>
         </div>
      </div>

      <style>{`
        .admin-settings-page { display: flex; flex-direction: column; gap: 32px; }
        
        .settings-hero { padding: 48px; background: #0f172a; color: white; border: none; }
        .profile-large { display: flex; align-items: center; gap: 32px; }
        .avatar-huge { width: 96px; height: 96px; background: #3b82f6; border-radius: 28px; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 900; }
        .profile-text h2 { font-size: 28px; font-weight: 800; margin: 0 0 4px; }
        .profile-text p { font-size: 15px; color: #94a3b8; margin: 0; font-weight: 600; }

        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        .settings-section { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
        .settings-section h3 { font-size: 16px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }

        .setting-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
        .setting-row span { font-size: 14px; color: #64748b; font-weight: 600; }
        .setting-row b { font-size: 15px; color: #0f172a; }
        .access-high { color: #10b981 !important; }

        /* Simple toggle switch */
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #e2e8f0; transition: .4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #3b82f6; }
        input:checked + .slider:before { transform: translateX(20px); }

        @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default AdminSettings;
