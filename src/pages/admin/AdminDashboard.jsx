import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    student_count: 0,
    teacher_count: 0,
    avg_accuracy: 0,
    school_progress: 0,
    quiz_completion_rate: 0,
    daily_active_users: 0
  });
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [attendanceRate, setAttendanceRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, notificationsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminNotifications()
      ]);

      if (statsRes) setStats(statsRes);
      if (notificationsRes) setAdminNotifications(Array.isArray(notificationsRes) ? notificationsRes : []);

      // Fetch attendance summary
      try {
        const res = await fetch('/api/admin/attendance/summary');
        const data = await res.json();
        if (data?.data?.overall_rate !== undefined) {
          setAttendanceRate(data.data.overall_rate);
        }
      } catch (e) { console.log('Attendance not available'); }

    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="admin-dashboard-home animate-fade">
      {/* Quick Stats Grid */}
      <div className="stats-grid-premium">
        {[
          { label: 'Enrolled Students', value: stats?.student_count || 0, icon: '👨‍🎓', color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Active Faculty', value: stats?.teacher_count || 0, icon: '👨‍🏫', color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Daily Attendance', value: (attendanceRate || 0) + '%', icon: '📅', color: '#10b981', bg: '#ecfdf5' },
          { label: 'Platform Accuracy', value: Math.round(stats?.avg_accuracy || 0) + '%', icon: '🎯', color: '#f59e0b', bg: '#fffbeb' },
        ].map((item, i) => (
          <div key={i} className="stat-card-web vq-card">
            <div className="stat-icon-web" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
            <div className="stat-info-web">
               <p className="stat-label-web">{item.label}</p>
               <h3 className="stat-value-web">{item.value}</h3>
            </div>
            <div className="stat-trend-web pos">↑ 12%</div>
          </div>
        ))}
      </div>

      <div className="dashboard-main-columns">
        <div className="primary-column">
          {/* Performance Card */}
          <div className="vq-card performance-card">
            <div className="card-header-admin">
               <h3>📊 Platform Performance</h3>
               <button className="btn-text-admin">View Details</button>
            </div>
            <div className="metrics-list-admin">
               {[
                 { label: 'Overall Learning Progress', value: stats?.school_progress || 0.65, color: '#10b981' },
                 { label: 'Quiz Completion Velocity', value: stats?.quiz_completion_rate || 0.82, color: '#3b82f6' },
                 { label: 'Daily Engagement Depth', value: stats?.daily_active_users || 0.45, color: '#8b5cf6' }
               ].map((m, i) => (
                 <div key={i} className="metric-item-admin">
                    <div className="metric-meta">
                       <span>{m.label}</span>
                       <b>{Math.round(m.value * 100)}%</b>
                    </div>
                    <div className="progress-track-admin">
                       <div className="progress-fill-admin" style={{ width: `${m.value * 100}%`, background: m.color }}></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Recent Transmissions */}
          <div className="vq-card alert-card">
             <div className="card-header-admin">
                <h3>🔔 System Broadcasts</h3>
                <span className="badge-count">{adminNotifications.length}</span>
             </div>
             <div className="admin-notif-list">
                {adminNotifications.length > 0 ? adminNotifications.map((notif, i) => (
                  <div key={i} className="admin-notif-item">
                     <div className="notif-bullet"></div>
                     <div className="notif-content">
                        <h4>{notif.title}</h4>
                        <p>{notif.message}</p>
                     </div>
                     <span className="notif-time">{notif.time}</span>
                  </div>
                )) : <p className="empty-msg">No active system alerts.</p>}
             </div>
          </div>
        </div>

        <div className="secondary-column">
           <div className="status-widget vq-card">
              <div className="pulse-indicator"></div>
              <h4>System Operational</h4>
              <p>All core modules are functioning within optimal parameters.</p>
              <div className="uptime-grid">
                 <div className="uptime-dot ok"></div>
                 <div className="uptime-dot ok"></div>
                 <div className="uptime-dot ok"></div>
                 <div className="uptime-dot ok"></div>
                 <div className="uptime-dot ok"></div>
                 <div className="uptime-dot warning"></div>
                 <div className="uptime-dot ok"></div>
              </div>
           </div>

           <div className="quick-access-tools vq-card">
              <h3>Maintenance Tools</h3>
              <div className="tool-links">
                 <button className="tool-btn">Clear System Cache</button>
                 <button className="tool-btn">Reindex Search</button>
                 <button className="tool-btn">Database Health Check</button>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard-home { width: 100%; display: flex; flex-direction: column; gap: 32px; }
        
        .stats-grid-premium {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .stat-card-web {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
        }

        .stat-icon-web {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-label-web { margin: 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .stat-value-web { margin: 4px 0 0; font-size: 24px; font-weight: 900; color: #0f172a; }
        .stat-trend-web { position: absolute; top: 16px; right: 16px; font-size: 11px; font-weight: 800; }
        .stat-trend-web.pos { color: #10b981; }

        .dashboard-main-columns {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 32px;
        }

        .primary-column { display: flex; flex-direction: column; gap: 32px; }
        .secondary-column { display: flex; flex-direction: column; gap: 32px; }

        .card-header-admin { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .card-header-admin h3 { margin: 0; font-size: 18px; font-weight: 800; color: #0f172a; }
        .btn-text-admin { border: none; background: none; color: #3b82f6; font-weight: 700; font-size: 13px; cursor: pointer; }

        .metrics-list-admin { display: flex; flex-direction: column; gap: 24px; }
        .metric-item-admin { display: flex; flex-direction: column; gap: 10px; }
        .metric-meta { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; }
        .metric-meta span { color: #64748b; }
        .progress-track-admin { height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; }
        .progress-fill-admin { height: 100%; border-radius: 5px; }

        .admin-notif-list { display: flex; flex-direction: column; gap: 12px; }
        .admin-notif-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: #f8fafc; border-radius: 12px; }
        .notif-bullet { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; }
        .notif-content { flex: 1; }
        .notif-content h4 { margin: 0 0 4px; font-size: 14px; font-weight: 700; }
        .notif-content p { margin: 0; font-size: 12px; color: #64748b; }
        .notif-time { font-size: 11px; color: #94a3b8; font-weight: 600; }

        .status-widget { padding: 32px; text-align: center; }
        .pulse-indicator { width: 12px; height: 12px; background: #10b981; border-radius: 50%; margin: 0 auto 16px; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); animation: pulse 2s infinite; }
        .status-widget h4 { margin: 0 0 8px; font-size: 16px; font-weight: 800; }
        .status-widget p { font-size: 12px; color: #64748b; margin: 0 0 20px; line-height: 1.5; }
        
        .uptime-grid { display: flex; gap: 6px; justify-content: center; }
        .uptime-dot { width: 4px; height: 16px; border-radius: 2px; }
        .uptime-dot.ok { background: #10b981; }
        .uptime-dot.warning { background: #f59e0b; }

        .quick-access-tools { padding: 32px; }
        .quick-access-tools h3 { margin: 0 0 20px; font-size: 15px; font-weight: 800; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .tool-links { display: flex; flex-direction: column; gap: 10px; }
        .tool-btn { padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; background: white; color: #475569; font-weight: 700; font-size: 13px; text-align: left; cursor: pointer; transition: 0.2s; }
        .tool-btn:hover { background: #f8fafc; border-color: #3b82f6; color: #3b82f6; }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        @media (max-width: 1200px) {
          .stats-grid-premium { grid-template-columns: 1fr 1fr; }
          .dashboard-main-columns { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .stats-grid-premium { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
