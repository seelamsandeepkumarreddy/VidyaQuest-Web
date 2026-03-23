import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';

const TeacherAssignments = () => {
  const [session, setSession] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    title: '',
    subject: '',
    due_date: '',
    description: ''
  });

  useEffect(() => {
    const user = sessionManager.getUser();
    if (user) {
      setSession(user);
      fetchAssignments(user.grade);
    }
  }, []);

  const fetchAssignments = async (grade) => {
    setLoading(true);
    try {
      const data = await api.getTeacherAssignments(grade || '8');
      setAssignments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.createAssignment({
        author_id: session.id,
        grade: session.grade,
        ...assignmentData
      });
      alert('✅ Assignment created successfully!');
      setIsModalOpen(false);
      setAssignmentData({ title: '', subject: '', due_date: '', description: '' });
      fetchAssignments(session.grade);
    } catch (error) {
      alert('Failed to create assignment');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="teacher-assignments-page animate-fade">
      <div className="page-header-actions">
        <h2 className="section-title">Assignment Management</h2>
        <button className="btn-web-primary" onClick={() => setIsModalOpen(true)}>
          + Create New Task
        </button>
      </div>

      <div className="assignments-content-web">
        {assignments.length === 0 ? (
          <div className="empty-assignments-web vq-card">
            <div className="empty-icon-web">📚</div>
            <h3>No Active Assignments</h3>
            <p>You haven't posted any assignments for Grade {session?.grade} yet.</p>
            <button className="btn-web-outline" onClick={() => setIsModalOpen(true)}>
              Launch First Assignment
            </button>
          </div>
        ) : (
          <div className="assignments-grid-web">
            {assignments.map((a, idx) => (
              <div key={a.id || idx} className="assignment-card-premium vq-card animate-scale-up">
                <div className="card-top-meta">
                   <div className="subject-tag-web">{a.subject || 'General'}</div>
                   <div className="grade-tag-web">Grade {a.grade || session?.grade}</div>
                </div>
                
                <h3 className="assignment-title-web">{a.title}</h3>
                <p className="assignment-desc-web">{a.description || a.message || 'No specific instructions provided.'}</p>
                
                <div className="assignment-footer-web">
                   <div className="due-date-display">
                      <span className="due-lbl">Due Date</span>
                      <span className="due-val">{a.due_date ? new Date(a.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible'}</span>
                   </div>
                   <div className="completion-stats-mini">
                      <b>18/24</b> Handed in
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {isModalOpen && (
        <div className="modal-overlay-web animate-fade" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content-web vq-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header-web">
              <h2 className="modal-title-web">Create New Assignment</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={createAssignment} className="modal-body-web">
              <div className="form-grid-web">
                <div className="vq-input-group full-width">
                  <label className="vq-label">Assignment Title</label>
                  <input
                    type="text"
                    className="vq-input"
                    value={assignmentData.title}
                    onChange={e => setAssignmentData({ ...assignmentData, title: e.target.value })}
                    placeholder="e.g. Weekly Math Quiz"
                    required
                  />
                </div>
                <div className="vq-input-group">
                  <label className="vq-label">Subject</label>
                  <input
                    type="text"
                    className="vq-input"
                    value={assignmentData.subject}
                    onChange={e => setAssignmentData({ ...assignmentData, subject: e.target.value })}
                    placeholder="Mathematics"
                    required
                  />
                </div>
                <div className="vq-input-group">
                  <label className="vq-label">Due Date</label>
                  <input
                    type="date"
                    className="vq-input"
                    value={assignmentData.due_date}
                    onChange={e => setAssignmentData({ ...assignmentData, due_date: e.target.value })}
                    required
                  />
                </div>
                <div className="vq-input-group full-width">
                  <label className="vq-label">Instructions / Description</label>
                  <textarea
                    className="vq-input"
                    value={assignmentData.description}
                    onChange={e => setAssignmentData({ ...assignmentData, description: e.target.value })}
                    style={{ minHeight: '120px', resize: 'vertical' }}
                    placeholder="Describe the task and goals..."
                  />
                </div>
              </div>
              
              <div className="form-actions-web">
                <button type="button" className="btn-web-outline" onClick={() => setIsModalOpen(false)}>Discard</button>
                <button type="submit" className="btn-web-primary">Publish Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .teacher-assignments-page { width: 100%; }
        
        .page-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .section-title { font-size: 24px; font-weight: 800; margin: 0; }

        .assignments-grid-web {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
        }

        .assignment-card-premium {
          padding: 28px;
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .assignment-card-premium:hover {
          transform: translateY(-5px);
          border-color: #f59e0b;
          box-shadow: 0 15px 40px rgba(245, 158, 11, 0.08);
        }

        .card-top-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .subject-tag-web {
          background: #fef3c7;
          color: #92400e;
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .grade-tag-web {
          background: #f1f5f9;
          color: #64748b;
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 800;
        }

        .assignment-title-web {
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 12px;
          color: #1e293b;
        }

        .assignment-desc-web {
          font-size: 15px;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 28px;
          flex: 1;
        }

        .assignment-footer-web {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
        }

        .due-date-display { display: flex; flex-direction: column; }
        .due-lbl { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
        .due-val { font-size: 14px; font-weight: 800; color: #ef4444; }

        .completion-stats-mini { font-size: 13px; color: #64748b; }
        .completion-stats-mini b { color: #1e293b; }

        .empty-assignments-web {
          padding: 80px 40px;
          text-align: center;
          background: white;
        }

        .empty-icon-web { font-size: 64px; margin-bottom: 24px; }
        .empty-assignments-web h3 { font-size: 24px; font-weight: 800; margin-bottom: 12px; }
        .empty-assignments-web p { color: #64748b; margin-bottom: 32px; }

        /* Modal Overrides */
        .modal-overlay-web {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 24px;
        }

        .modal-content-web {
          background: white !important;
          max-width: 700px;
          width: 100%;
          border-radius: 32px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          overflow: hidden;
          position: relative;
        }

        .modal-header-web {
          padding: 28px 32px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-body-web {
          padding: 32px;
        }

        .form-grid-web {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .full-width { grid-column: span 2; }

        /* Reset global vq-input-group centering for modal */
        .modal-body-web .vq-input-group {
          margin-left: 0;
          margin-right: 0;
          max-width: 100%;
          margin-bottom: 0;
        }

        .form-actions-web {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
        }

        @media (max-width: 600px) {
          .form-grid-web { grid-template-columns: 1fr; }
          .full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default TeacherAssignments;
