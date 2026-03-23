import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { sessionManager } from '../utils/session';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login(email, password);
      sessionManager.setUser(data.user);
      
      // Handle must_change_password flag (matches Android ForceChangePasswordScreen)
      if (data.user.must_change_password === true || data.user.must_change_password === 'yes') {
        navigate('/change-password');
        return;
      }
      
      const role = (data.user.role || '').trim().toLowerCase();
      if (role === 'student') {
        navigate('/dashboard');
      } else if (['teacher', 'faculty'].includes(role)) {
        navigate('/teacher/dashboard');
      } else if (['admin', 'administrator'].includes(role)) {
        navigate('/admin/dashboard');
      } else {
        setError('Login successful, but role "' + data.user.role + '" is not recognized.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
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
        <div className="animate-fade" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
          <h2 className="text-headline">Welcome Back</h2>
          <p className="text-secondary">Please enter your details to sign in</p>
        </div>

        <div className="vq-card animate-fade" style={{ padding: '40px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          {error && (
            <div style={{ background: '#FFEBEE', color: '#D32F2F', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="vq-input-group" style={{ maxWidth: '100%', margin: '0 0 24px' }}>
              <label className="vq-label">Email Address</label>
              <input 
                type="email" 
                className="vq-input" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="vq-input-group" style={{ maxWidth: '100%', margin: '0 0 12px' }}>
              <label className="vq-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="vq-input" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: 0.5 }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '32px' }}>
              <Link to="/forgot-password" style={{ color: 'var(--green-primary)', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="vq-button btn-primary" 
              disabled={loading}
              style={{ padding: '16px', width: '100%', maxWidth: 'none' }}
            >
              {loading ? 'Please wait...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p className="text-secondary" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              New user? Please contact your administrator to create an account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
