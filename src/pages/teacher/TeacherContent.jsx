import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';

const TeacherContent = () => {
  const [session, setSession] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState('chapter'); // chapter, quiz
  
  // Chapter form state
  const [chapterData, setChapterData] = useState({
    title: '',
    subject_id: '',
    description: '',
    pdf_url: ''
  });

  // Quiz form state
  const [quizData, setQuizData] = useState({
    chapter_id: '',
    questions: [
      { question: '', options: ['', '', '', ''], correct_answer: 0, points: 10 }
    ]
  });

  const [createdChapters, setCreatedChapters] = useState([]);

  useEffect(() => {
    const user = sessionManager.getUser();
    if (user) {
      setSession(user);
      fetchInitialData(user.grade);
    }
  }, []);

  const fetchInitialData = async (grade) => {
    setLoading(true);
    try {
      const subjectsData = await api.getSubjects(grade || '8');
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      
      // We'll need a way to get chapters to link quizzes
      // For now we'll assume the subjects have chapters or we fetch them
      if (subjectsData.length > 0) {
        const firstSub = subjectsData[0].id;
        const chaptersData = await api.getChapters(firstSub);
        setCreatedChapters(Array.isArray(chaptersData) ? chaptersData : []);
      }
    } catch (error) {
       console.error('Failed to fetch content data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    try {
      await api.createChapter(chapterData);
      alert('✅ Chapter created successfully!');
      setChapterData({ title: '', subject_id: '', description: '', pdf_url: '' });
      fetchInitialData(session.grade);
    } catch (error) {
      alert('Failed to create chapter');
    }
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { question: '', options: ['', '', '', ''], correct_answer: 0, points: 10 }]
    });
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await api.createQuiz(quizData);
      alert('✅ Quiz created successfully!');
      setQuizData({ chapter_id: '', questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0, points: 10 }] });
    } catch (error) {
      alert('Failed to create quiz');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="teacher-content-page animate-fade">
      <div className="content-tabs-web">
        <button 
          className={`content-tab ${activeMode === 'chapter' ? 'active' : ''}`}
          onClick={() => setActiveMode('chapter')}
        >
          📚 Lesson Material
        </button>
        <button 
          className={`content-tab ${activeMode === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveMode('quiz')}
        >
          🎯 Assessment/Quiz
        </button>
      </div>

      <div className="content-form-container vq-card">
        {activeMode === 'chapter' ? (
          <form onSubmit={handleCreateChapter} className="premium-form">
            <h2 className="form-title-web">Upload New Lesson</h2>
            <p className="form-subtitle-web">Create a new chapter and link educational resources.</p>
            
            <div className="form-grid-web">
              <div className="vq-input-group full-width">
                <label className="vq-label">Chapter Title</label>
                <input 
                  type="text" 
                  className="vq-input" 
                  value={chapterData.title}
                  onChange={e => setChapterData({...chapterData, title: e.target.value})}
                  placeholder="e.g. Introduction to Quantum Physics" 
                  required
                />
              </div>
              <div className="vq-input-group">
                <label className="vq-label">Subject</label>
                <select 
                  className="vq-input"
                  value={chapterData.subject_id}
                  onChange={e => setChapterData({...chapterData, subject_id: e.target.value})}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="vq-input-group">
                <label className="vq-label">PDF Resource URL</label>
                <input 
                  type="text" 
                  className="vq-input" 
                  value={chapterData.pdf_url}
                  onChange={e => setChapterData({...chapterData, pdf_url: e.target.value})}
                  placeholder="https://..." 
                  required
                />
              </div>
              <div className="vq-input-group full-width">
                <label className="vq-label">Description / Objectives</label>
                <textarea 
                  className="vq-input"
                  value={chapterData.description}
                  onChange={e => setChapterData({...chapterData, description: e.target.value})}
                  placeholder="What will students learn in this chapter?"
                  style={{ minHeight: '120px' }}
                />
              </div>
            </div>
            
            <div className="form-footer-web">
               <button type="submit" className="btn-web-primary">Publish Chapter</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateQuiz} className="premium-form">
            <h2 className="form-title-web">Build Assessment</h2>
            <p className="form-subtitle-web">Add interactive questions to an existing chapter.</p>
            
            <div className="vq-input-group" style={{ maxWidth: '400px' }}>
              <label className="vq-label">Select Chapter</label>
              <select 
                className="vq-input"
                value={quizData.chapter_id}
                onChange={e => setQuizData({...quizData, chapter_id: e.target.value})}
                required
              >
                <option value="">Choose a Chapter</option>
                {createdChapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <div className="questions-builder">
              {quizData.questions.map((q, qIdx) => (
                <div key={qIdx} className="question-card-builder">
                  <div className="question-header">
                    <h4>Question {qIdx + 1}</h4>
                    <button type="button" className="btn-remove" onClick={() => {
                       const newQs = [...quizData.questions];
                       newQs.splice(qIdx, 1);
                       setQuizData({...quizData, questions: newQs});
                    }}>Remove</button>
                  </div>
                  
                  <textarea 
                    className="vq-input q-text-area"
                    placeholder="Enter question text..."
                    value={q.question}
                    onChange={e => {
                      const newQs = [...quizData.questions];
                      newQs[qIdx].question = e.target.value;
                      setQuizData({...quizData, questions: newQs});
                    }}
                    required
                  />

                  <div className="options-grid">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="option-input-wrapper">
                        <input 
                          type="radio" 
                          name={`correct-${qIdx}`}
                          checked={q.correct_answer === oIdx}
                          onChange={() => {
                            const newQs = [...quizData.questions];
                            newQs[qIdx].correct_answer = oIdx;
                            setQuizData({...quizData, questions: newQs});
                          }}
                        />
                        <input 
                          type="text" 
                          className="vq-input opt-input"
                          placeholder={`Option ${oIdx + 1}`}
                          value={opt}
                          onChange={e => {
                            const newQs = [...quizData.questions];
                            newQs[qIdx].options[oIdx] = e.target.value;
                            setQuizData({...quizData, questions: newQs});
                          }}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <button type="button" className="btn-add-q" onClick={addQuestion}>
                + Add Another Question
              </button>
            </div>

            <div className="form-footer-web">
               <button type="submit" className="btn-web-primary" style={{ width: '100%' }}>Finalize Quiz</button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .teacher-content-page { width: 100%; max-width: 900px; margin: 0 auto; }
        
        .content-tabs-web {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .content-tab {
          flex: 1;
          padding: 16px;
          background: white;
          border: 1px solid #eef2f6;
          border-radius: 16px;
          font-weight: 800;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .content-tab.active {
          background: var(--green-primary);
          color: white;
          border-color: var(--green-primary);
          box-shadow: 0 10px 20px rgba(46, 125, 50, 0.15);
        }

        .form-title-web { margin: 0 0 8px; font-size: 24px; font-weight: 800; }
        .form-subtitle-web { margin: 0 0 32px; color: #64748b; font-weight: 600; font-size: 15px; }

        .form-grid-web {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .full-width { grid-column: span 2; }
        
        /* Reset global vq-input-group centering and max-width for this page */
        .teacher-content-page .vq-input-group {
          margin-left: 0;
          margin-right: 0;
          max-width: 100%;
        }

        .form-footer-web {
          display: flex;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
        }

        .questions-builder {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin: 32px 0;
        }

        .question-card-builder {
          padding: 24px;
          background: #f8fafc;
          border-radius: 20px;
          border: 1px solid #eef2f6;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .question-header h4 { margin: 0; font-size: 16px; font-weight: 800; }
        
        .btn-remove {
          background: none;
          border: none;
          color: #ef4444;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }

        .q-text-area {
          min-height: 80px;
          margin-bottom: 20px;
          background: white;
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .option-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid #eef2f6;
        }

        .opt-input {
          border: none;
          padding: 8px 0;
          background: transparent;
        }

        .opt-input:focus { border: none; }

        .btn-add-q {
          padding: 16px;
          background: white;
          border: 2px dashed #e2e8f0;
          border-radius: 16px;
          color: #64748b;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add-q:hover {
          border-color: var(--green-primary);
          color: var(--green-primary);
          background: #f0fdf4;
        }

        @media (max-width: 600px) {
          .form-grid-web, .options-grid { grid-template-columns: 1fr; }
          .full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default TeacherContent;
