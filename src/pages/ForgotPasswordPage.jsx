import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setStep(2);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.verifyOtp(email, otp);
      setStep(3);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.resetPassword(email, newPassword);
      navigate('/login');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="app-container" style={{ 
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="text-headline">{step === 3 ? 'Reset Password' : 'Account Recovery'}</h2>
          <p className="text-secondary">
            {step === 1 && "Enter your email to receive an OTP code"}
            {step === 2 && `We've sent a 6-digit code to ${email}`}
            {step === 3 && "Secure your account with a new password"}
          </p>
        </div>

        <div className="vq-card animate-fade" style={{ padding: '40px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          {error && (
            <div style={{ background: '#FFEBEE', color: '#D32F2F', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <div className="vq-input-group" style={{ maxWidth: '100%', margin: '0 0 32px' }}>
                <label className="vq-label">Email Address</label>
                <input type="email" className="vq-input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your.email@example.com" />
              </div>
              <button type="submit" className="vq-button btn-primary" disabled={loading} style={{ maxWidth: 'none' }}>
                {loading ? 'Sending...' : 'Send Recovery Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <div className="vq-input-group" style={{ maxWidth: '100%', margin: '0 0 32px' }}>
                <label className="vq-label">Verification OTP</label>
                <input type="text" className="vq-input" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="••••••" style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px' }} />
              </div>
              <button type="submit" className="vq-button btn-primary" disabled={loading} style={{ maxWidth: 'none' }}>
                {loading ? 'Verifying...' : 'Verify & Proceed'}
              </button>
              <button type="button" onClick={() => setStep(1)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '20px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Change Email</button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="vq-input-group" style={{ maxWidth: '100%', margin: '0 0 32px' }}>
                <label className="vq-label">New Password</label>
                <input type="password" className="vq-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Enter new password" />
              </div>
              <button type="submit" className="vq-button btn-primary" disabled={loading} style={{ maxWidth: 'none' }}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
             <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>← Back to Secure Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
