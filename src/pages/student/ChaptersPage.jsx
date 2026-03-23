import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';
import BottomNav from '../../components/BottomNav';

const ChaptersPage = () => {
  const { subjectId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const userId = sessionManager.getUserId();
  const grade = sessionManager.getGrade();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chaptersRes, subjectsRes, progressRes] = await Promise.all([
          api.getChapters(subjectId),
          api.getSubjects(grade),
          api.getProgress(userId)
        ]);

        const chaptersData = Array.isArray(chaptersRes) ? chaptersRes : [];
        const subjectsData = Array.isArray(subjectsRes) ? subjectsRes : [];
        const progressData = progressRes || {};

        const currentSub = subjectsData.find(s => s.id === parseInt(subjectId));
        const subjectTitle = currentSub?.title || 'General';
        
        // Merge progress data into chapters
        const key = `${grade}-${subjectTitle}`;
        const completedList = (progressData.completed_chapters && progressData.completed_chapters[key]) || [];
        const badgesMap = (progressData.earned_badges && progressData.earned_badges[subjectTitle]) || {};

        const mergedChapters = chaptersData.map(ch => ({
          ...ch,
          is_completed: completedList.includes(ch.title),
          badge: badgesMap[ch.title] || null
        }));

        setChapters(mergedChapters);
        setSubject(currentSub);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        // Fallback to empty states on error to prevent white screen
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId, userId, grade]);

  const completedCount = chapters.filter(c => c.is_completed).length;
  const totalCount = chapters.length;

  const getBadgeIcon = (badge) => {
    if (!badge) return null;
    let color = '#ccc';
    switch(badge.toLowerCase()) {
      case 'gold': color = '#FFD700'; break;
      case 'silver': color = '#C0C0C0'; break;
      case 'bronze': color = '#CD7F32'; break;
      default: return null;
    }
    return (
      <span title={badge} style={{ 
        color: color, 
        fontSize: '18px', 
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        display: 'inline-flex',
        alignItems: 'center'
      }}>
        🏆
      </span>
    );
  };

  const getChapterProgress = (chapter) => {
    return chapter.progress || (chapter.is_completed ? 1 : (chapter.is_in_progress ? 0.5 : 0));
  };

  return (
    <div className="chapters-wrapper">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '0 12px 0 0' }}>←</button>
          <h2 className="text-headline">{subject?.title || 'Subject Chapters'}</h2>
        </div>
        <p className="text-secondary">Explore all chapters and test your knowledge</p>
      </div>

      <div className="chapters-container-layout">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <div className="loader"></div>
            <p>Loading chapters...</p>
          </div>
        ) : (
          <div className="chapters-grid-view">
            
            {/* Curriculum Summary Card */}
            <div className="vq-card animate-fade curriculum-summary">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--green-primary)' }}>Grade {subject?.grade || '8'} Curriculum</h4>
                <div className="completion-badge">{Math.round(totalCount > 0 ? (completedCount / totalCount) * 100 : 0)}% Done</div>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}></div>
              </div>
              <p className="summary-text">{completedCount} of {totalCount} chapters mastered</p>
            </div>

            {/* Chapters List */}
            <div className="chapters-list-enhanced">
              {chapters.length > 0 ? chapters.map((chapter, index) => {
                const progress = getChapterProgress(chapter);
                const isCompleted = chapter.is_completed || progress >= 1;
                const isInProgress = chapter.is_in_progress || (progress > 0 && progress < 1);
                const badgeEmoji = getBadgeIcon(chapter.badge);

                return (
                  <div 
                    key={chapter.id} 
                    className={`vq-card animate-fade chapter-row-card ${isCompleted ? 'completed' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="chapter-row-content">
                      {/* Chapter Indicator */}
                      <div className={`chapter-number-box ${isCompleted ? 'done' : isInProgress ? 'working' : ''}`}>
                        {isCompleted ? '✓' : (index + 1)}
                      </div>

                      {/* Info Section */}
                      <div className="chapter-main-info">
                        <div className="chapter-title-row">
                          <h4 className="chapter-display-title">Chapter {index + 1}: {chapter.title}</h4>
                          {badgeEmoji && <span className="chapter-badge-icon">{badgeEmoji}</span>}
                        </div>
                        <div className="chapter-meta">
                          <span className="lesson-count">{chapter.lessons_count || 1} Interactive Lesson(s)</span>
                          {chapter.is_offline && <span className="offline-tag">Offline Available</span>}
                        </div>
                      </div>

                      {/* Desktop Progress & Actions */}
                      <div className="chapter-actions-desktop">
                        <div className="progress-info-mini">
                           <span className="percent-text">{Math.round(progress * 100)}%</span>
                           <div className="mini-progress-dot-track">
                             <div className="mini-progress-dot-fill" style={{ width: `${progress * 100}%` }}></div>
                           </div>
                        </div>
                        <div className="button-group-row">
                          <button 
                            onClick={() => navigate(`/chapters/${chapter.id}/lesson`, { state: { pdfUrl: chapter.pdf_url } })}
                            className="vq-button btn-outline-sm"
                          >
                            Read Lesson
                          </button>
                          <button 
                            onClick={() => {
                              const subTitle = subject?.title || 'General';
                              sessionManager.setSubject(subTitle);
                              sessionManager.setChapterName(chapter.title);
                              navigate(`/chapters/${chapter.id}/quiz`, { 
                                state: { 
                                  subject: subTitle,
                                  chapterName: chapter.title,
                                  grade: subject?.grade || '8'
                                } 
                              });
                            }}
                            className="vq-button btn-primary-sm"
                          >
                            Take Quiz
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📚</span>
                  <p className="text-secondary">No chapters found for this subject yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .chapters-container-layout {
          max-width: 1000px;
          margin: 0 auto;
        }

        .curriculum-summary {
          margin-bottom: 32px;
          background: linear-gradient(135deg, white 0%, #f1f8e9 100%);
          border: 1px solid rgba(46, 125, 50, 0.1);
        }

        .completion-badge {
          background: var(--green-primary);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 800;
        }

        .progress-track {
          height: 10px;
          background: #e2e8f0;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .progress-fill {
          height: 100%;
          background: var(--green-primary);
          border-radius: 5px;
          transition: width 0.6s ease-in-out;
        }

        .summary-text {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .chapters-list-enhanced {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chapter-row-card {
          padding: 24px !important;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .chapter-row-card:hover {
          transform: translateX(8px);
          border-color: var(--green-primary);
          box-shadow: var(--shadow-lg);
        }

        .chapter-row-card.completed {
          background: #fdfdfd;
        }

        .chapter-row-content {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .chapter-number-box {
          width: 56px;
          height: 56px;
          background: #f1f5f9;
          color: var(--text-secondary);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .chapter-number-box.done {
          background: #E8F5E9;
          color: #2E7D32;
          font-size: 24px;
        }

        .chapter-number-box.working {
          background: #E3F2FD;
          color: #1565C0;
        }

        .chapter-main-info {
          flex: 1;
        }

        .chapter-display-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .chapter-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }

        .chapter-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lesson-count {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .offline-tag {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          background: #E8F5E9;
          color: #2E7D32;
          text-transform: uppercase;
        }

        .chapter-actions-desktop {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .progress-info-mini {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .percent-text {
          font-size: 12px;
          font-weight: 800;
          color: var(--text-secondary);
        }

        .mini-progress-dot-track {
          width: 60px;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
        }

        .mini-progress-dot-fill {
          height: 100%;
          background: var(--blue-primary);
          border-radius: 2px;
        }

        .button-group-row {
          display: flex;
          gap: 8px;
        }

        .btn-outline-sm {
          padding: 8px 16px !important;
          font-size: 13px !important;
          background: white !important;
          color: var(--green-primary) !important;
          border: 1px solid var(--green-primary) !important;
          width: auto !important;
        }

        .btn-primary-sm {
          padding: 8px 16px !important;
          font-size: 13px !important;
          width: auto !important;
          margin: 0 !important;
        }

        @media (max-width: 768px) {
          .chapter-row-content {
            flex-direction: column;
            align-items: flex-start;
          }
          .chapter-actions-desktop {
            width: 100%;
            align-items: stretch;
            margin-top: 16px;
            border-top: 1px solid #f1f5f9;
            padding-top: 16px;
          }
          .button-group-row {
            flex-direction: column;
          }
          .btn-outline-sm, .btn-primary-sm {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChaptersPage;
