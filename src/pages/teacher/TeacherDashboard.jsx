import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';

const TeacherDashboard = () => {
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState({
    student_count: 0,
    avg_accuracy: 0,
    attendance_rate: 0,
    assignments_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  useEffect(() => {
    const user = sessionManager.getUser();
    if (user) {
      setSession(user);
      fetchDashboardData(user.grade);
    }
  }, []);

  const fetchDashboardData = async (grade) => {
    setLoading(true);
    try {
      const studentsData = await api.getTeacherStudents(grade || '8');
      
      let assignmentsList = [];
      try {
        assignmentsList = await api.getTeacherAssignments(grade || '8');
      } catch (e) { }

      const today = new Date().toISOString().split('T')[0];
      let todayAttendance = [];
      try {
        todayAttendance = await api.getAttendanceByDate(grade || '8', today);
        if (Array.isArray(todayAttendance) && todayAttendance.length > 0) {
          setAttendanceSubmitted(true);
        }
      } catch (e) { }

      let avgAccuracy = 0;
      try {
        const statsRes = await api.getAdminStats();
        if (statsRes) avgAccuracy = statsRes.avg_accuracy || 0;
      } catch (e) { }

      const presentToday = todayAttendance.filter(a => a.status === 'PRESENT').length;
      const totalStudents = (studentsData || []).length;
      const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

      setStats({
        student_count: totalStudents,
        avg_accuracy: Math.round(avgAccuracy),
        attendance_rate: attendanceSubmitted ? attendanceRate : '--',
        assignments_count: Array.isArray(assignmentsList) ? assignmentsList.length : 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="teacher-dashboard-page animate-fade">
      <div className="welcome-section vq-card">
         <div className="welcome-text">
            <h2>Welcome back, Professor!</h2>
            <p>Here's what's happening in your Grade {session?.grade} classroom today.</p>
         </div>
         <div className="welcome-decoration">🏫</div>
      </div>

      <div className="stats-grid-teacher">
        {[
          { label: 'Total Students', value: stats.student_count, icon: '👥', color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Avg Accuracy', value: stats.avg_accuracy + '%', icon: '🎯', color: '#10b981', bg: '#ecfdf5' },
          { label: 'Daily Attendance', value: stats.attendance_rate === '--' ? 'Pending' : stats.attendance_rate + '%', icon: '📅', color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Tasks Posted', value: stats.assignments_count, icon: '📝', color: '#f59e0b', bg: '#fffbeb' }
        ].map((stat, i) => (
          <div key={i} className="stat-card-premium vq-card animate-scale-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-icon-wrapper" style={{ background: stat.bg, color: stat.color }}>
               {stat.icon}
            </div>
            <div className="stat-info-main">
               <span className="stat-lbl-web">{stat.label}</span>
               <h3 className="stat-val-web">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-insights-row">
        <div className="insight-card-main vq-card" style={{ gridColumn: 'span 2' }}>
           <h3 className="insight-title-web">Today's Focus</h3>
           <div className="focus-list">
              <div className={`focus-item ${attendanceSubmitted ? 'done' : 'pending'}`}>
                 <span className="focus-status-icon">{attendanceSubmitted ? '✅' : '🔴'}</span>
                 <div className="focus-content">
                    <h4>Roll Call</h4>
                    <p>{attendanceSubmitted ? 'Attendance was recorded successfully.' : 'You still need to take attendance for today.'}</p>
                 </div>
              </div>
              <div className="focus-item pending">
                 <span className="focus-status-icon">📝</span>
                 <div className="focus-content">
                    <h4>New Assignment</h4>
                    <p>Share a quick practice set with your students.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .teacher-dashboard-page { width: 100%; }

        .welcome-section {
          padding: 40px;
          background: linear-gradient(135deg, var(--green-primary), #1b5e20);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          border: none;
        }

        .welcome-text h2 { font-size: 32px; font-weight: 800; margin: 0 0 8px; }
        .welcome-text p { font-size: 16px; opacity: 0.9; margin: 0; font-weight: 500; }
        .welcome-decoration { font-size: 64px; }

        .stats-grid-teacher {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card-premium {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          transition: transform 0.2s;
        }

        .stat-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-lbl-web { font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-val-web { font-size: 24px; font-weight: 900; margin: 4px 0 0; color: var(--text-main); }

        .dashboard-insights-row {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 32px;
        }

        .insight-card-main { padding: 32px; }
        .insight-title-web { font-size: 20px; font-weight: 800; margin-bottom: 24px; }
        
        .focus-list { display: flex; flex-direction: column; gap: 24px; }
        .focus-item { display: flex; gap: 20px; position: relative; }
        .focus-item:not(:last-child):after {
          content: '';
          position: absolute;
          left: 12px;
          top: 30px;
          bottom: -20px;
          width: 2px;
          background: #f1f5f9;
        }

        .focus-status-icon {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          background: white;
          z-index: 1;
        }

        .focus-content h4 { font-size: 16px; font-weight: 700; margin: 0 0 4px; color: #1e293b; }
        .focus-content p { font-size: 14px; color: #64748b; margin: 0; }
        .focus-item.done h4 { color: #10b981; }

        .promotion-card-teacher {
          background: #fef3c7;
          border: 1px solid #fde68a;
          padding: 32px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .promo-flare {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #f59e0b;
          color: white;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .promotion-card-teacher h3 { font-size: 22px; font-weight: 800; color: #92400e; margin: 0 0 16px; }
        .promotion-card-teacher p { font-size: 15px; color: #b45309; line-height: 1.6; margin: 0 0 24px; }
        .btn-promo-web { background: #f59e0b; border: none; font-weight: 800; }
        .btn-promo-web:hover { background: #d97706; }

        @media (max-width: 1200px) {
          .stats-grid-teacher { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 991px) {
          .dashboard-insights-row { grid-template-columns: 1fr; }
          .promotion-card-teacher { order: -1; }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;
