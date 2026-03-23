import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminAnalytics();
      setAnalytics(res);
    } catch (e) {
      console.error('Analytics failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="admin-analytics-page animate-fade">
      <div className="analytics-hero-grid">
         {[
           { label: 'Platform Users', value: analytics?.total_users || 0, icon: '👥', color: '#3b82f6' },
           { label: 'Active Today', value: analytics?.active_today || 0, icon: '🔥', color: '#ef4444' },
           { label: 'Lessons Taken', value: analytics?.lessons_taken || 0, icon: '📚', color: '#10b981' },
           { label: 'Avg Session', value: (analytics?.avg_session || 0) + 'm', icon: '⏱️', color: '#8b5cf6' }
         ].map((s, i) => (
           <div key={i} className="a-stat-card vq-card">
              <div className="a-stat-icon" style={{ background: s.color + '10', color: s.color }}>{s.icon}</div>
              <div className="a-stat-info">
                 <p className="a-stat-lbl">{s.label}</p>
                 <h3 className="a-stat-val">{s.value}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="detailed-metrics-row">
         <div className="metrics-card vq-card">
            <h3 className="metrics-title">⚡ User Engagement</h3>
            <div className="engagement-bars">
               {Object.entries(analytics?.engagement || {}).map(([k, v]) => (
                 <div key={k} className="eng-bar-item">
                    <div className="bar-meta">
                       <span className="bar-lbl">{k.replace(/_/g, ' ')}</span>
                       <span className="bar-val">{v}%</span>
                    </div>
                    <div className="bar-track">
                       <div className="bar-fill" style={{ width: `${v}%`, background: '#3b82f6' }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="metrics-card vq-card">
            <h3 className="metrics-title">🛡️ System Intelligence</h3>
            <div className="health-list">
               {Object.entries(analytics?.system_health || {}).map(([k, v]) => (
                 <div key={k} className="health-row">
                    <span className="health-lbl">{k.replace(/_/g, ' ')}</span>
                    <span className={`health-status ${v === 'Operational' || v === 'Healthy' ? 'ok' : ''}`}>
                       {typeof v === 'number' && k.includes('pct') ? v + '%' : v}
                    </span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="growth-chart-card vq-card">
         <h3 className="metrics-title">📈 Registration Velocity (Monthly)</h3>
         <div className="growth-bars-container">
            {(analytics?.growth || []).map((g, i) => (
              <div key={i} className="growth-col">
                 <div 
                   className="growth-bar" 
                   style={{ height: `${Math.min(100, (g.count / (analytics?.total_users || 1)) * 500)}%` }}
                 ></div>
                 <span className="growth-month">{g.month}</span>
                 <span className="growth-count">{g.count}</span>
              </div>
            ))}
         </div>
      </div>

      <style>{`
        .admin-analytics-page { display: flex; flex-direction: column; gap: 32px; }
        
        .analytics-hero-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .a-stat-card { display: flex; align-items: center; gap: 20px; padding: 24px; }
        .a-stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .a-stat-lbl { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin: 0; }
        .a-stat-val { font-size: 24px; font-weight: 900; color: #0f172a; margin: 4px 0 0; }

        .detailed-metrics-row { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        .metrics-card { padding: 32px; }
        .metrics-title { font-size: 18px; font-weight: 800; margin-bottom: 24px; color: #0f172a; }

        .engagement-bars { display: flex; flex-direction: column; gap: 20px; }
        .bar-meta { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; font-weight: 700; }
        .bar-lbl { color: #64748b; text-transform: capitalize; }
        .bar-track { height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }

        .health-list { display: flex; flex-direction: column; gap: 16px; }
        .health-row { display: flex; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
        .health-lbl { font-size: 13px; color: #64748b; text-transform: capitalize; font-weight: 600; }
        .health-status { font-size: 13px; font-weight: 800; color: #0f172a; }
        .health-status.ok { color: #10b981; }

        .growth-chart-card { padding: 40px; }
        .growth-bars-container { display: flex; gap: 16px; align-items: flex-end; height: 180px; margin-top: 32px; }
        .growth-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .growth-bar { width: 100%; background: #3b82f6; border-radius: 6px 6px 2px 2px; min-height: 4px; }
        .growth-month { font-size: 11px; font-weight: 700; color: #64748b; }
        .growth-count { font-size: 12px; font-weight: 800; color: #0f172a; }

        @media (max-width: 1200px) { .analytics-hero-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 768px) { 
           .detailed-metrics-row { grid-template-columns: 1fr; }
           .growth-bars-container { overflow-x: auto; padding-bottom: 16px; }
        }
      `}</style>
    </div>
  );
};

export default AdminAnalytics;
