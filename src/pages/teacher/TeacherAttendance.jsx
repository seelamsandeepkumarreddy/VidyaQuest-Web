import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';

const TeacherAttendance = () => {
  const [session, setSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [absentIds, setAbsentIds] = useState([]);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = sessionManager.getUser();
    if (user) {
      setSession(user);
      fetchData(user.grade);
    }
  }, []);

  const fetchData = async (grade) => {
    setLoading(true);
    try {
      const studentsData = await api.getTeacherStudents(grade || '8');
      setStudents(studentsData || []);

      const today = new Date().toISOString().split('T')[0];
      const todayData = await api.getAttendanceByDate(grade || '8', today);
      if (Array.isArray(todayData) && todayData.length > 0) {
        setAttendanceSubmitted(true);
      }

      const history = await api.getAttendanceHistory(grade || '8');
      setAttendanceHistory(Array.isArray(history) ? history : []);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceToggle = (id) => {
    setAbsentIds(prev =>
      prev.includes(id) ? prev.filter(aId => aId !== id) : [...prev, id]
    );
  };

  const submitAttendance = async () => {
    try {
      await api.submitAttendance({
        teacher_id: session.id,
        grade: session.grade,
        absent_students: absentIds.map(id => ['student', id]),
        date: new Date().toISOString().split('T')[0]
      });
      setAttendanceSubmitted(true);
      alert('✅ Attendance submitted successfully!');
      fetchData(session.grade);
    } catch (error) {
      alert('Failed to submit attendance');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="teacher-attendance-page animate-fade">
      <div className="attendance-header-web">
        <div>
          <h2 className="section-title">Daily Attendance</h2>
          <p className="date-display-web">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        {!attendanceSubmitted && (
          <button className="btn-web-primary btn-submit-web" onClick={submitAttendance}>
            ✅ Submit Roll Call
          </button>
        )}
      </div>

      <div className="attendance-content-layout">
        <div className="attendance-main-list vq-card">
          {attendanceSubmitted ? (
            <div className="submitted-state-web">
              <div className="success-icon-large">🎉</div>
              <h3>Attendance Completed</h3>
              <p>The roll call for today has been securely recorded.</p>
              <div className="mini-stats-row">
                 <div className="pill-stat present">Present: {students.length - absentIds.length}</div>
                 <div className="pill-stat absent">Absent: {absentIds.length}</div>
              </div>
            </div>
          ) : (
            <div className="roll-call-list">
              <div className="instructions-box-web">
                <span className="bulb-icon">💡</span>
                <p>Click on the student row or check the <b>Absent</b> box for students not present today.</p>
              </div>
              
              <div className="students-scroll-list">
                {students.map(s => (
                  <div 
                    key={s.id} 
                    className={`attendance-row-web ${absentIds.includes(s.id) ? 'is-absent' : 'is-present'}`}
                    onClick={() => handleAttendanceToggle(s.id)}
                  >
                    <div className="row-left">
                       <div className="row-avatar">{s.name?.charAt(0)}</div>
                       <div className="row-info">
                          <span className="row-name">{s.name}</span>
                          <span className="row-id">ID: {s.id}</span>
                       </div>
                    </div>
                    <div className="row-right">
                       <div className={`status-tag ${absentIds.includes(s.id) ? 'tag-absent' : 'tag-present'}`}>
                          {absentIds.includes(s.id) ? 'Absent' : 'Present'}
                       </div>
                       <input 
                         type="checkbox" 
                         checked={absentIds.includes(s.id)} 
                         onChange={() => {}} // Handled by row onClick
                         className="attendance-checkbox-web"
                       />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="attendance-sidebar-web">
          <div className="vq-card history-card-web">
            <h3 className="card-subtitle-web">Recent Activity</h3>
            <div className="history-list-web">
              {attendanceHistory.length === 0 ? (
                <p className="empty-text">No history records found.</p>
              ) : (
                attendanceHistory.slice(0, 8).map((record, i) => (
                  <div key={i} className="history-item-web">
                    <div className="history-date-box">
                       {record.date?.split('-')[2] || record.attendance_date?.split('-')[2]}
                       <span>{new Date(record.date || record.attendance_date).toLocaleDateString(undefined, { month: 'short' })}</span>
                    </div>
                    <div className="history-info-box">
                       <p className="history-name">{record.student_name || record.full_name}</p>
                       <span className={`history-status ${record.status === 'PRESENT' ? 'color-green' : 'color-red'}`}>
                         {record.status}
                       </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .teacher-attendance-page { width: 100%; }
        
        .attendance-header-web {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .date-display-web {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 4px 0 0;
          font-weight: 600;
        }

        .attendance-content-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 32px;
        }

        .attendance-main-list {
          padding: 0;
          overflow: hidden;
          background: white;
        }

        .instructions-box-web {
          display: flex;
          gap: 16px;
          padding: 24px 32px;
          background: #f0fdfa;
          border-bottom: 1px solid #ccfbf1;
          align-items: center;
        }

        .instructions-box-web p {
          margin: 0;
          font-size: 14px;
          color: #0f766e;
          font-weight: 600;
        }

        .bulb-icon { font-size: 20px; }

        .students-scroll-list {
          padding: 16px;
          max-height: 600px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .attendance-row-web {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .attendance-row-web:hover {
          background: #f8fafc;
        }

        .is-absent {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .is-absent:hover { background: #fee2e2; }

        .row-left { display: flex; align-items: center; gap: 16px; }
        .row-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #64748b;
        }

        .row-name { display: block; font-weight: 700; color: #1e293b; }
        .row-id { font-size: 12px; color: #94a3b8; font-weight: 600; }

        .row-right { display: flex; align-items: center; gap: 20px; }
        
        .status-tag {
          padding: 4px 12px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .tag-present { background: #dcfce7; color: #166534; }
        .tag-absent { background: #fee2e2; color: #991b1b; }

        .attendance-checkbox-web {
          width: 20px;
          height: 20px;
          accent-color: #ef4444;
          cursor: pointer;
        }

        .submitted-state-web {
          padding: 80px 40px;
          text-align: center;
        }

        .success-icon-large { font-size: 64px; margin-bottom: 24px; }
        .submitted-state-web h3 { font-size: 24px; font-weight: 800; margin-bottom: 12px; }
        .submitted-state-web p { color: #64748b; margin-bottom: 32px; }

        .mini-stats-row { display: flex; justify-content: center; gap: 16px; }
        .pill-stat { padding: 12px 24px; border-radius: 20px; font-weight: 800; font-size: 14px; }
        .pill-stat.present { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        .pill-stat.absent { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

        .history-card-web { padding: 24px; }
        .card-subtitle-web { font-size: 18px; font-weight: 800; margin-bottom: 20px; }
        
        .history-item-web {
          display: flex;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px dashed #e2e8f0;
        }

        .history-date-box {
          background: #f8fafc;
          border: 1px solid #eef2f6;
          padding: 8px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: 800;
          min-width: 50px;
          font-size: 16px;
        }

        .history-date-box span { font-size: 10px; text-transform: uppercase; color: #94a3b8; }
        .history-name { margin: 0; font-weight: 700; font-size: 14px; }
        .history-status { font-size: 12px; font-weight: 800; }
        .color-green { color: #10b981; }
        .color-red { color: #ef4444; }

        @media (max-width: 991px) {
          .attendance-content-layout { grid-template-columns: 1fr; }
          .attendance-sidebar-web { order: -1; }
        }
      `}</style>
    </div>
  );
};

export default TeacherAttendance;
