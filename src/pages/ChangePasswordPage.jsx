import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { sessionManager } from '../utils/session';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const navigate = useNavigate();
  const email = sessionManager.getEmail();

  useEffect(() => {
    if (!sessionManager.isLoggedIn()) {
      navigate('/login');
    } else if (!sessionManager.getMustChangePassword()) {
      redirectBasedOnRole(sessionManager.getRole());
    }
  }, [navigate]);

  const redirectBasedOnRole = (role) => {
    const r = (role || '').trim().toLowerCase();
    if (r === 'student') navigate('/dashboard');
    else if (['teacher', 'faculty'].includes(r)) navigate('/teacher/dashboard');
    else if (['admin', 'administrator', 'superadmin'].includes(r)) navigate('/admin/dashboard');
    else navigate('/');
  };

  const handleCancel = () => {
    sessionManager.logout();
    navigate('/login');
  };

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Include at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Include at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Include at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Include at least one special character";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Correct keys for backend: current_password and new_password
      await api.changePassword({
        email: email,
        current_password: currentPassword,
        new_password: newPassword
      });
      
      sessionManager.updateUser({ must_change_password: false });
      redirectBasedOnRole(sessionManager.getRole());
    } catch (err) {
      setErrorMessage(err.message || "Update failed. Check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="force-change-container">
      {/* Decorative background elements */}
      <div className="bg-circle bg-circle-1" />
      <div className="bg-circle bg-circle-2" />

      <div className="force-change-card animate-fade">
        <div className="card-content">
          <div className="icon-surface">
            <span className="lock-icon">🔒</span>
          </div>

          <h2 className="title">Secure Your Account</h2>
          <p className="subtitle">
            Welcome to VidyaQuest! For your security, please update your temporary password to a permanent one.
          </p>

          {errorMessage && (
            <div className="error-surface">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="input-field">
              <label>Temporary Password</label>
              <div className="input-wrapper">
                <input
                  type={currentPasswordVisible ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setErrorMessage(null); }}
                  placeholder="Enter current/temp password"
                  required
                />
                <button type="button" onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)} className="toggle-btn">
                  {currentPasswordVisible ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="input-field">
              <label>New Secure Password</label>
              <div className="input-wrapper">
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setErrorMessage(null); }}
                  placeholder="Enter new password"
                  required
                />
                <button type="button" onClick={() => setNewPasswordVisible(!newPasswordVisible)} className="toggle-btn">
                  {newPasswordVisible ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <div className="requirements-list">
                <span className={newPassword.length >= 8 ? 'met' : ''}>Min 8 chars</span>
                <span className={/[A-Z]/.test(newPassword) ? 'met' : ''}>Upper Case</span>
                <span className={/[a-z]/.test(newPassword) ? 'met' : ''}>Lower Case</span>
                <span className={/[0-9]/.test(newPassword) ? 'met' : ''}>Numbers</span>
                <span className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'met' : ''}>Special Char</span>
              </div>
            </div>

            <div className="input-field">
              <label>Confirm New Password</label>
              <div className="input-wrapper">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrorMessage(null); }}
                  placeholder="Confirm new password"
                  required
                />
                <button type="button" onClick={() => confirmPasswordVisible(!confirmPasswordVisible)} className="toggle-btn">
                  {confirmPasswordVisible ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            >
              {isLoading ? (
                <div className="spinner-mini"></div>
              ) : (
                "Update My Password"
              )}
            </button>

            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel and Sign Out
            </button>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .force-change-container {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 20px;
          margin: 0;
          color: #0f172a;
          font-family: inherit;
        }

        .bg-circle {
          position: absolute;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          pointer-events: none;
        }

        .bg-circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          left: -100px;
        }

        .bg-circle-2 {
          width: 200px;
          height: 200px;
          bottom: -50px;
          right: -50px;
        }

        .force-change-card {
          width: 100%;
          max-width: 460px;
          background: rgba(255, 255, 255, 0.98);
          border-radius: 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          z-index: 10;
        }

        .card-content {
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .icon-surface {
          width: 70px;
          height: 70px;
          background: #ecfdf5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .lock-icon {
          font-size: 32px;
        }

        .title {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
          text-align: center;
        }

        .subtitle {
          font-size: 14px;
          color: #64748b;
          text-align: center;
          line-height: 1.5;
          margin-bottom: 32px;
          max-width: 320px;
        }

        .error-surface {
          width: 100%;
          background: #fef2f2;
          padding: 14px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          border: 1px solid #fee2e2;
        }

        .error-text {
          color: #b91c1c;
          font-size: 13px;
          font-weight: 600;
        }

        .form-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-field label {
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          margin-left: 4px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 14px;
          border: 2px solid #e2e8f0;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
          background: white;
        }

        .input-wrapper input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .requirements-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
          margin-left: 4px;
        }

        .requirements-list span {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          background: #f1f5f9;
          color: #94a3b8;
          border-radius: 20px;
          transition: all 0.3s;
        }

        .requirements-list span.met {
          background: #dcfce7;
          color: #166534;
        }

        .toggle-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          opacity: 0.4;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-btn {
          margin-top: 12px;
          height: 56px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
        }

        .submit-btn:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
        }

        .submit-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }

        .cancel-btn {
          background: none;
          border: none;
          color: #94a3b8;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          padding: 8px;
          margin-top: 4px;
          transition: color 0.2s;
        }

        .cancel-btn:hover {
          color: #475569;
        }

        .spinner-mini {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .animate-fade {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default ChangePasswordPage;
