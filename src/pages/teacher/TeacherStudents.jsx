import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentReport, setStudentReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const user = sessionManager.getUser();
    if (user) {
      setSession(user);
      fetchStudents(user.grade);
    }
  }, []);

  const fetchStudents = async (grade) => {
    setLoading(true);
    try {
      const data = await api.getTeacherStudents(grade || '8');
      setStudents(data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewStudentReport = async (student) => {
    setSelectedStudent(student);
    setReportLoading(true);
    try {
      const report = await api.getStudentReport(student.id);
      setStudentReport(report);
    } catch (error) {
      console.error('Failed to fetch report:', error);
      setStudentReport({ error: true });
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="teacher-students-page animate-fade">
      <div className="page-header-actions">
        <h2 className="section-title">My Classroom ({students.length} Students)</h2>
        <div className="header-filters">
           <input type="text" placeholder="Filter by name..." className="simple-filter-input" />
        </div>
      </div>

      <div className="students-grid-web">
        {students.length === 0 ? (
          <div className="empty-state-card vq-card">
            <p>No students found for Grade {session?.grade}.</p>
          </div>
        ) : (
          students.map(s => (
            <div key={s.id} className="student-card-web vq-card animate-scale-up">
              <div className="student-card-main">
                <div className="student-avatar-large">
                  {s.name?.charAt(0)}
                </div>
                <div className="student-meta-info">
                  <h3 className="student-name-web">{s.name}</h3>
                  <p className="student-id-web">ID: {s.id}</p>
                </div>
              </div>
              
              <div className="student-stats-preview">
                 <div className="mini-stat-box">
                    <span className="mini-stat-lbl">Grade</span>
                    <span className="mini-stat-val">A</span>
                 </div>
                 <div className="mini-stat-box">
                    <span className="mini-stat-lbl">Attendance</span>
                    <span className="mini-stat-val">95%</span>
                 </div>
              </div>

              <div className="student-card-footer">
                <button
                  className="btn-web-primary btn-sm-web"
                  onClick={() => viewStudentReport(s)}
                >
                  📊 Performance Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Modal */}
      {selectedStudent && (
        <div className="modal-overlay-web animate-fade" onClick={() => { setSelectedStudent(null); setStudentReport(null); }}>
          <div className="modal-content-web vq-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header-web">
              <h2 className="modal-title-web">Student Achievement Record</h2>
              <button className="close-modal-btn" onClick={() => { setSelectedStudent(null); setStudentReport(null); }}>✕</button>
            </div>

            <div className="modal-body-web">
              <div className="student-profile-header-modal">
                 <div className="avatar-modal">{selectedStudent.name?.charAt(0)}</div>
                 <div className="info-modal">
                    <h3>{selectedStudent.name}</h3>
                    <p>Grade {selectedStudent.grade || session?.grade} • ID: {selectedStudent.id}</p>
                 </div>
              </div>

              {reportLoading ? (
                <div className="loading-report">
                  <div className="spinner"></div>
                  <p>Retrieving student records...</p>
                </div>
              ) : studentReport?.error ? (
                <div className="report-error-state">
                  <p>No progress data available for this student yet.</p>
                </div>
              ) : studentReport && (
                <div className="report-dashboard-mini">
                  <div className="report-grid-web">
                    {[
                      { label: 'Cumulative XP', value: studentReport.total_xp || 0, icon: '⭐', color: '#f59e0b' },
                      { label: 'Avg Accuracy', value: (studentReport.average_accuracy || 0) + '%', icon: '🎯', color: '#10b981' },
                      { label: 'Perfect Score', value: studentReport.perfect_quizzes || 0, icon: '🏆', color: '#ec4899' },
                      { label: 'Study Time', value: (studentReport.total_study_time || 0) + ' min', icon: '⏱️', color: '#3b82f6' },
                      { label: 'Consistency', value: studentReport.high_accuracy_quizzes || 0, icon: '📈', color: '#8b5cf6' },
                      { label: 'Modules Done', value: studentReport.lessons_completed || 0, icon: '📚', color: '#06b6d4' },
                    ].map((stat, i) => (
                      <div key={i} className="report-card-mini">
                        <div className="stat-icon-mini" style={{ color: stat.color }}>{stat.icon}</div>
                        <div className="stat-value-mini">{stat.value}</div>
                        <div className="stat-label-mini">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .teacher-students-page {
          width: 100%;
        }

        .page-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }

        .students-grid-web {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .student-card-web {
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #f1f5f9;
        }

        .student-card-web:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
          border-color: var(--green-primary);
        }

        .student-card-main {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .student-avatar-large {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: #f0fdf4;
          color: var(--green-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 800;
          box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0.1);
        }

        .student-name-web {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }

        .student-id-web {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 4px 0 0;
          font-weight: 600;
        }

        .student-stats-preview {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .mini-stat-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mini-stat-lbl {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mini-stat-val {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-main);
        }

        .btn-sm-web {
          width: 100%;
          padding: 12px;
          font-size: 14px;
          border-radius: 12px;
        }

        /* Modal Styles */
        .modal-overlay-web {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }

        .modal-content-web {
          max-width: 700px;
          width: 100%;
          padding: 0;
          overflow: hidden;
          background: white;
          border-radius: 32px;
        }

        .modal-header-web {
          padding: 24px 32px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title-web {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
        }

        .close-modal-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #94a3b8;
          transition: color 0.2s;
        }

        .close-modal-btn:hover {
          color: #ef4444;
        }

        .modal-body-web {
          padding: 32px;
        }

        .student-profile-header-modal {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          padding: 24px;
          background: #f8fafc;
          border-radius: 24px;
        }

        .avatar-modal {
          width: 72px;
          height: 72px;
          background: var(--green-primary);
          color: white;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 900;
        }

        .info-modal h3 {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
        }

        .info-modal p {
          margin: 4px 0 0;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .report-grid-web {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .report-card-mini {
          padding: 20px;
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 20px;
          text-align: center;
          transition: all 0.2s;
        }

        .report-card-mini:hover {
          border-color: var(--green-primary);
          background: #f0fdf4;
        }

        .stat-icon-mini {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .stat-value-mini {
          font-size: 20px;
          font-weight: 900;
          color: #1e293b;
        }

        .stat-label-mini {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .report-grid-web {
            grid-template-columns: repeat(2, 1fr);
          }
          .page-header-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherStudents;
