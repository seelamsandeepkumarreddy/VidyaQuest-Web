import React from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container" style={{ 
      background: 'linear-gradient(135deg, #1b5e20 0%, #2E7D32 50%, #1565C0 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '40px',
      color: 'white',
      overflow: 'hidden'
    }}>
      <div className="animate-fade" style={{ maxWidth: '600px' }}>
        <div style={{ 
          width: '120px', 
          height: '120px', 
          background: 'white', 
          borderRadius: '30px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '60px', 
          margin: '0 auto 32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          transform: 'rotate(-5deg)'
        }}>
          📖
        </div>
        
        <h1 className="text-headline" style={{ fontSize: '56px', marginBottom: '16px', color: 'white' }}>VidyaQuest</h1>
        <p style={{ fontSize: '20px', opacity: 0.9, marginBottom: '48px', lineHeight: '1.6' }}>
          Empowering the next generation of rural students through interactive digital learning.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <button 
            className="vq-button" 
            onClick={() => navigate('/login')}
            style={{ 
              background: 'white', 
              color: 'var(--green-primary)', 
              fontSize: '18px', 
              padding: '18px 64px',
              maxWidth: '300px'
            }}
          >
            Get Started
          </button>
          
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '40px', fontSize: '12px', opacity: 0.6 }}>
        © 2026 VidyaQuest Educational Initiative. All rights reserved.
      </div>
    </div>
  );
};

export default SplashPage;
