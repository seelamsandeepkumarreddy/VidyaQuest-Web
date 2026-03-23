import React, { useState } from 'react';
import { api } from '../../utils/api';

const AdminAnnouncements = () => {
  const [announcement, setAnnouncement] = useState('');
  const [targetGrade, setTargetGrade] = useState('8');
  const [loading, setLoading] = useState(false);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement) return;
    setLoading(true);
    try {
      await api.createAnnouncement({ content: announcement, target_grade: targetGrade });
      alert('✅ Announcement broadcasted successfully!');
      setAnnouncement('');
    } catch (e) {
      alert('Failed to send announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-announce-page animate-fade">
      <div className="announcement-composer vq-card">
         <div className="composer-header">
            <h3>📢 Create Global Broadcast</h3>
            <p>Send an immediate notification to students of a specific grade.</p>
         </div>

         <form onSubmit={handleCreateAnnouncement} className="composer-form">
            <div className="composer-grid">
               <div className="input-field-admin">
                  <label>Target Audience</label>
                  <select 
                    className="vq-input" 
                    value={targetGrade} 
                    onChange={(e) => setTargetGrade(e.target.value)}
                  >
                    {['6','7','8','9','10','All'].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
               </div>
               
               <div className="input-field-admin full-width">
                  <label>Announcement Message</label>
                  <textarea 
                    className="vq-input" 
                    placeholder="Type your message here..."
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    style={{ minHeight: '180px', padding: '20px' }}
                    required
                  ></textarea>
               </div>
            </div>

            <div className="composer-footer">
               <button type="submit" className="btn-web-primary" disabled={loading}>
                 {loading ? 'Sending...' : 'Broadcast to All Selected'}
               </button>
            </div>
         </form>
      </div>


      <style>{`
        .admin-announce-page { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }
        
        .announcement-composer { padding: 48px; }
        .composer-header { margin-bottom: 40px; text-align: left; border-bottom: 1px solid #f1f5f9; padding-bottom: 24px; }
        .composer-header h3 { font-size: 24px; font-weight: 800; margin: 0 0 10px; color: #0f172a; }
        .composer-header p { color: #64748b; font-size: 15px; margin: 0; opacity: 0.8; }

        .composer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
        .full-width { grid-column: span 2; }

        .input-field-admin { display: flex; flex-direction: column; gap: 12px; }
        .input-field-admin label { font-size: 14px; font-weight: 800; color: #475569; letter-spacing: 0.025em; }
        
        .vq-input { 
          border: 2px solid #e2e8f0; 
          border-radius: 14px; 
          font-size: 15px; 
          transition: all 0.2s; 
          background: #f8fafc;
        }
        .vq-input:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }

        .composer-footer { display: flex; justify-content: flex-end; padding-top: 32px; border-top: 1px solid #f1f5f9; }
        .composer-footer button { padding: 16px 48px; border-radius: 14px; font-size: 15px; font-weight: 800; }


        @media (max-width: 768px) {
           .composer-grid { grid-template-columns: 1fr; }
           .full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminAnnouncements;
