import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';

const RegisterPage = () => {
  const [role, setRole] = useState('Student');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: '8',
    subjectExpertise: '',
    experience: '',
    adminCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password) {
      return setError('Please fill all required fields');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    if ((role === 'Student' || role === 'Teacher') && !formData.grade) {
      return setError("Please select your grade");
    }
    if (role === 'Teacher' && !formData.subjectExpertise) {
      return setError("Please select your subject expertise");
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: role.trim(),
        school_name: '',
        grade: formData.grade
      };
      
      if (role === 'Teacher') {
        payload.subject_expertise = formData.subjectExpertise.trim();
        payload.experience = formData.experience.trim() || null;
      }
      
      await api.register(payload);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const grades = ['8', '9', '10'];
  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Telugu'];

  return (
    <div className="app-container" style={{ 
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px'
    }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>
        {/* Header */}
        <div className="animate-fade" style={{ textAlign: 'center', marginBottom: '40px' }}>
           <h2 className="text-headline">{role} Registration</h2>
           <p className="text-secondary">Create your account and start learning</p>
        </div>

        {/* Role Selector */}
        <div style={{ 
          display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px',
          background: 'white', padding: '6px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          {['Student', 'Teacher', 'Administrator'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => { setRole(r); setError(''); }}
              style={{
                padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: '700',
                background: role === r ? 'var(--green-primary)' : 'transparent',
                color: role === r ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="vq-card animate-fade" style={{ padding: '40px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '800' }}>Create Account</h3>
          <p className="text-secondary" style={{ margin: '0 0 32px', fontSize: '14px' }}>Fill in the details below to get started</p>

          {error && (
            <div style={{ background: '#FFEBEE', color: '#D32F2F', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', textAlign: 'center', fontWeight: '600' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="vq-input-group" style={{ maxWidth: '100%', margin: '0 0 20px' }}>
              <label className="vq-label">Full Name <span style={{ color: 'red' }}>*</span></label>
              <input 
                type="text" 
                className="vq-input" 
                placeholder="Enter your full name" 
                value={formData.fullName}
                onChange={(e) => { setFormData({...formData, fullName: e.target.value}); setError(''); }}
                required
              />
            </div>

            {/* Grade Selection - For Student & Teacher */}
            {(role === 'Student' || role === 'Teacher') && (
              <div style={{ marginBottom: '24px' }}>
                <label className="vq-label">{role === 'Student' ? 'Select Grade' : 'Assigned Grade'} <span style={{ color: 'red' }}>*</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '8px' }}>
                  {grades.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({...formData, grade: g})}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: formData.grade === g ? '2px solid var(--green-primary)' : '1px solid #e2e8f0',
                        background: formData.grade === g ? 'var(--green-bg)' : 'white',
                        color: formData.grade === g ? 'var(--green-primary)' : 'var(--text-main)',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Grade {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Teacher-Specific Fields */}
            {role === 'Teacher' && (
              <>
                <div className="vq-input-group" style={{ maxWidth: '100%', margin: '0 0 20px' }}>
                  <label className="vq-label">Subject Expertise <span style={{ color: 'red' }}>*</span></label>
                  <select
                    className="vq-input"
                    value={formData.subjectExpertise}
                    onChange={(e) => setFormData({...formData, subjectExpertise: e.target.value})}
                    style={{ background: 'white' }}
                  >
                    <option value="">Choose Subject</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="vq-input-group" style={{ maxWidth: '100%', margin: '0 0 20px' }}>
                  <label className="vq-label">Experience (Years)</label>
                  <input 
                    type="text" 
                    className="vq-input" 
                    placeholder="e.g., 5" 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  />
                </div>
              </>
            )}

            {/* Admin-Specific Fields */}
            {role === 'Administrator' && (
              <div className="vq-input-group" style={{ maxWidth: '100%', margin: '0 0 20px' }}>
                <label className="vq-label">Admin Role / Access Code <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  className="vq-input" 
                  placeholder="Enter access code" 
                  value={formData.adminCode}
                  onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
                />
              </div>
            )}

            {/* Email */}
            <div className="vq-input-group" style={{ maxWidth: '100%', margin: '0 0 20px' }}>
              <label className="vq-label">Email <span style={{ color: 'red' }}>*</span></label>
              <input 
                type="email" 
                className="vq-input" 
                placeholder="example@email.com" 
                value={formData.email}
                onChange={(e) => { setFormData({...formData, email: e.target.value}); setError(''); }}
                required
              />
            </div>

            {/* Password Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
               <div className="vq-input-group" style={{ maxWidth: '100%', margin: 0 }}>
                <label className="vq-label">Password <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="password" 
                  className="vq-input" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => { setFormData({...formData, password: e.target.value}); setError(''); }}
                  required
                />
              </div>
              <div className="vq-input-group" style={{ maxWidth: '100%', margin: 0 }}>
                <label className="vq-label">Confirm</label>
                <input 
                  type="password" 
                  className="vq-input" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword}
                  onChange={(e) => { setFormData({...formData, confirmPassword: e.target.value}); setError(''); }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="vq-button btn-primary" 
              disabled={loading}
              style={{ padding: '16px', width: '100%', maxWidth: 'none' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p className="text-secondary" style={{ fontSize: '15px' }}>
              Already registered? {' '}
              <Link to="/login" style={{ color: 'var(--green-primary)', fontWeight: '800', textDecoration: 'none' }}>
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
