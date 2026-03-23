import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRes = await api.getAdminUsers();
      setUsers(Array.isArray(usersRes) ? usersRes : []);
    } catch (error) {
       console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    if (window.confirm('Approve this user for platform access?')) {
      try {
        await api.approveUser(id);
        alert('✅ User approved!');
        fetchUsers();
      } catch (error) {
        alert('Failed to approve user');
      }
    }
  };

  const deleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"? This cannot be undone.`)) {
      try {
        await api.deleteUser(id);
        alert('User deleted.');
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleUserClick = async (userId) => {
    try {
      const detail = await api.getAdminUserDetail(userId);
      setSelectedUserDetail(detail);
      setShowModal(true);
    } catch (error) {
      alert('Failed to fetch user reports');
    }
  };

  const filteredUsers = Array.isArray(users)
    ? (roleFilter === 'all' ? users : users.filter(u => u?.role?.toLowerCase() === roleFilter))
    : [];

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="admin-users-page animate-fade">
      <div className="users-controls vq-card">
         <div className="search-box-admin">
            <input type="text" placeholder="Search by name or email..." className="admin-search-input" />
         </div>
         <div className="role-pills">
            {['all', 'student', 'teacher', 'admin'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`role-pill ${roleFilter === role ? 'active' : ''}`}
              >
                {role}
              </button>
            ))}
         </div>
      </div>

      <div className="users-table-container vq-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User Identity</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="empty-row">No matching records found.</td></tr>
            ) : filteredUsers.map(u => (
              <tr key={u.id} className="hover-row-admin" onClick={() => handleUserClick(u.id)}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-mini">{u.name?.charAt(0)}</div>
                    <div>
                      <div className="user-name-bold">{u.name}</div>
                      <div className="user-email-tiny">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className={`role-tag ${u.role?.toLowerCase()}`}>{u.role}</span></td>
                <td><span className={`status-pill ${u.status || 'pending'}`}>{u.status || 'pending'}</span></td>
                <td>{u.joined_date || 'Mar 2024'}</td>
                <td onClick={e => e.stopPropagation()}>
                   <div className="action-btns">
                      {u.status === 'pending' && <button onClick={() => approveUser(u.id)} className="btn-approve-mini">Approve</button>}
                      <button onClick={() => deleteUser(u.id, u.name)} className="btn-delete-mini">Remove</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedUserDetail && (
        <div className="modal-overlay-admin animate-fade" onClick={() => setShowModal(false)}>
           <div className="modal-content-admin vq-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header-admin">
                 <div className="modal-profile">
                    <div className="modal-avatar">{selectedUserDetail.name.charAt(0)}</div>
                    <div>
                       <h3>{selectedUserDetail.name}</h3>
                       <p>{selectedUserDetail.role} • {selectedUserDetail.email}</p>
                    </div>
                 </div>
                 <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body-admin">
                 {selectedUserDetail.role?.toLowerCase() === 'student' ? (
                    <div className="detail-grid">
                       <div className="detail-item">
                          <label>Academic Standing</label>
                          <span>Grade {selectedUserDetail.grade || 'N/A'}</span>
                       </div>
                       <div className="detail-item">
                          <label>Platform Experience</label>
                          <span>{selectedUserDetail.total_xp || 0} XP Earned</span>
                       </div>
                       <div className="detail-item">
                          <label>Participation</label>
                          <span>{selectedUserDetail.quiz_count || 0} Quizzes Taken</span>
                       </div>
                       <div className="detail-item">
                          <label>Success Rate</label>
                          <span>{Math.round(selectedUserDetail.high_accuracy || 0)}% Avg</span>
                       </div>
                    </div>
                 ) : selectedUserDetail.role?.toLowerCase() === 'teacher' ? (
                    <div className="detail-grid">
                       <div className="detail-item">
                          <label>Assigned Grade</label>
                          <span>Grade {selectedUserDetail.assigned_grade || 'N/A'}</span>
                       </div>
                       <div className="detail-item">
                          <label>Subject Expertise</label>
                          <span style={{ textTransform: 'capitalize' }}>{selectedUserDetail.subject_expertise || 'N/A'}</span>
                       </div>
                       <div className="detail-item">
                          <label>Joined Date</label>
                          <span>{selectedUserDetail.created_at || 'N/A'}</span>
                       </div>
                       <div className="detail-item">
                          <label>Account Status</label>
                          <span style={{ textTransform: 'capitalize' }}>{selectedUserDetail.status || 'Active'}</span>
                       </div>
                    </div>
                 ) : (
                    <div className="detail-grid">
                       <div className="detail-item">
                          <label>Account Role</label>
                          <span style={{ textTransform: 'capitalize' }}>{selectedUserDetail.role || 'Admin'}</span>
                       </div>
                       <div className="detail-item">
                          <label>Joined Date</label>
                          <span>{selectedUserDetail.created_at || 'N/A'}</span>
                       </div>
                    </div>
                 )}
                 <div className="modal-actions-footer">
                    <button className="btn-web-outline" onClick={() => setShowModal(false)} style={{ width: '100%' }}>Close View</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .admin-users-page { display: flex; flex-direction: column; gap: 32px; }
        
        .users-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
        }

        .admin-search-input {
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          width: 320px;
          font-size: 14px;
        }

        .role-pills { display: flex; gap: 8px; }
        .role-pill {
          padding: 8px 16px;
          border-radius: 99px;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          text-transform: capitalize;
          transition: 0.2s;
        }

        .role-pill.active { background: #3b82f6; color: white; }

        .users-table-container { padding: 0; overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 18px 24px; background: #f8fafc; font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; }
        .admin-table td { padding: 18px 24px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }

        .hover-row-admin:hover { background: #fcfcfc; cursor: pointer; }

        .user-cell { display: flex; align-items: center; gap: 14px; }
        .user-avatar-mini {
          width: 36px; height: 36px; border-radius: 10px; background: #eff6ff;
          display: flex; align-items: center; justify-content: center; font-weight: 800; color: #3b82f6;
        }

        .user-name-bold { font-weight: 700; color: #0f172a; }
        .user-email-tiny { font-size: 12px; color: #64748b; }

        .role-tag {
          font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: capitalize;
        }
        .role-tag.student { background: #e0f2fe; color: #0369a1; }
        .role-tag.teacher { background: #fef3c7; color: #92400e; }
        .role-tag.admin { background: #fce4ec; color: #c2185b; }

        .status-pill {
          font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;
        }
        .status-pill.active { background: #dcfce7; color: #15803d; }
        .status-pill.pending { background: #ffedd5; color: #9a3412; }

        .action-btns { display: flex; gap: 8px; }
        .btn-approve-mini { background: #15803d; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 11px; cursor: pointer; }
        .btn-delete-mini { background: #fee2e2; color: #b91c1c; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 11px; cursor: pointer; }

        /* Modal admin */
        .modal-overlay-admin { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-content-admin { max-width: 600px; width: 100%; border-radius: 24px; overflow: hidden; padding: 0; }
        .modal-header-admin { padding: 32px; background: #0f172a; color: white; display: flex; justify-content: space-between; align-items: flex-start; }
        .modal-profile { display: flex; gap: 20px; align-items: center; }
        .modal-avatar { width: 64px; height: 64px; background: #3b82f6; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; }
        .close-btn { background: none; border: none; color: white; font-size: 32px; cursor: pointer; opacity: 0.6; }

        .modal-body-admin { padding: 32px; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
        .detail-item { display: flex; flex-direction: column; gap: 6px; }
        .detail-item label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .detail-item span { font-size: 18px; font-weight: 800; color: #0f172a; }

        .modal-actions-footer { display: flex; gap: 16px; padding-top: 24px; border-top: 1px solid #f1f5f9; }
        .modal-actions-footer button { flex: 1; }
      `}</style>
    </div>
  );
};

export default AdminUsers;
