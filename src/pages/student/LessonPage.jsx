import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';

const LessonPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get PDF URL from state (passed from ChaptersPage) or fallback to default
  const pdfUrl = location.state?.pdfUrl || `/api/pdfs/chapter_${chapterId}.pdf`;

  return (
    <div className="lesson-wrapper">
      <div className="lesson-container-layout animate-fade">
        {/* Header Bar */}
        <div className="lesson-sticky-header">
          <div className="lesson-header-left">
            <button 
              onClick={() => navigate(-1)} 
              className="lesson-back-btn"
            >
              ←
            </button>
            <div className="lesson-meta-info">
              <h2 className="lesson-main-title">Learning Resource: Chapter {chapterId}</h2>
              <p className="lesson-subtitle">Read the material carefully before starting the assessment</p>
            </div>
          </div>
          
          <div className="lesson-header-right">
            <button 
              className="btn-web-primary btn-start-quiz-now" 
              onClick={() => navigate(`/chapters/${chapterId}/quiz`)}
            >
              Ready for Quiz?
            </button>
          </div>
        </div>

        {/* PDF Container */}
        <div className="lesson-content-surface">
          <div className="pdf-viewer-frame">
            <iframe 
              src={pdfUrl} 
              className="lesson-iframe"
              title="Lesson Content"
            />
          </div>
        </div>
      </div>

      <style>{`
        .lesson-wrapper {
          height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
        }

        .lesson-container-layout {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 24px;
        }

        .lesson-sticky-header {
          padding: 24px 32px;
          background: white;
          border-radius: 20px 20px 0 0;
          border: 1px solid #f1f5f9;
          border-bottom: 2px solid #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 20;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }

        .lesson-header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .lesson-back-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .lesson-back-btn:hover {
          background: white;
          border-color: var(--green-primary);
          color: var(--green-primary);
          transform: translateX(-4px);
        }

        .lesson-main-title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
        }

        .lesson-subtitle {
          margin: 4px 0 0;
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .btn-start-quiz-now {
          padding: 12px 32px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 15px;
          box-shadow: 0 8px 20px rgba(46, 125, 50, 0.15);
        }

        .lesson-content-surface {
          flex: 1;
          background: white;
          border: 1px solid #f1f5f9;
          border-top: none;
          border-radius: 0 0 20px 20px;
          overflow: hidden;
          position: relative;
        }

        .pdf-viewer-frame {
          width: 100%;
          height: 100%;
        }

        .lesson-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        @media (max-width: 768px) {
          .lesson-container-layout { padding: 12px; }
          .lesson-sticky-header { padding: 16px; flex-direction: column; gap: 16px; align-items: flex-start; }
          .btn-start-quiz-now { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LessonPage;
