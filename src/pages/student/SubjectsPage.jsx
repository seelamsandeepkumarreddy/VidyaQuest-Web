import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';
import BottomNav from '../../components/BottomNav';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const grade = sessionManager.getGrade();

  const subjectStyles = [
    { bg: '#E3F2FD', color: '#1565C0', icon: '📐' }, // Math
    { bg: '#F1F8E9', color: '#2E7D32', icon: '🧪' }, // Science
    { bg: '#FFF3E0', color: '#EF6C00', icon: '🌍' }, // Social
    { bg: '#F3E5F5', color: '#7B1FA2', icon: '📝' }, // English
    { bg: '#E0F2F1', color: '#00695C', icon: '💻' }, // IT
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.getSubjects(grade);
        setSubjects(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [grade]);

  return (
    <div className="subjects-wrapper">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '0 8px 0 0' }}>←</button>
          <h2 className="text-headline">All Subjects</h2>
        </div>
        <p className="text-secondary" style={{ marginBottom: '32px' }}>Level up your knowledge across these core disciplines</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <div className="loader"></div>
          <p>Loading subjects...</p>
        </div>
      ) : (
        <div className="vq-grid subject-grid-enhanced">
          {subjects.map((subject, index) => {
            const style = subjectStyles[index % subjectStyles.length];
            return (
              <div 
                key={subject.id} 
                className="vq-card animate-fade subject-main-card" 
                onClick={() => navigate(`/subjects/${subject.id}/chapters`)}
                style={{ 
                  padding: '40px 24px', 
                  background: style.bg, 
                  border: 'none', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  animationDelay: `${index * 0.05}s`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontSize: '56px', marginBottom: '20px' }}>{style.icon}</div>
                <h3 style={{ fontSize: '20px', color: style.color, margin: '0 0 12px', fontWeight: '800' }}>{subject.title}</h3>
                <div style={{ 
                  fontSize: '11px', 
                  color: 'rgba(0,0,0,0.5)', 
                  fontWeight: '800', 
                  padding: '6px 16px', 
                  background: 'rgba(255,255,255,0.6)', 
                  borderRadius: '20px',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  {subject.subtitle || '0% COMPLETED'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .subject-main-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
          background: white !important;
          border: 1px solid rgba(0,0,0,0.05) !important;
        }
        
        @media (min-width: 992px) {
          .subject-grid-enhanced {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default SubjectsPage;
