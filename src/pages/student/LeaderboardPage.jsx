import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';
import BottomNav from '../../components/BottomNav';

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const grade = sessionManager.getGrade();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard(grade);
        setLeaders(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [grade]);

  const top3 = leaders.slice(0, 3);
  const others = leaders.slice(3);

  return (
    <div className="leaderboard-wrapper">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 className="text-headline">Leaderboard</h2>
        <p className="text-secondary">See how you rank against other students in Grade {grade}</p>
      </div>

      <div className="leaderboard-content-container">
        {/* Podium Section */}
        <div className="podium-section">
          {/* Silver - 2nd */}
          {top3[1] && (
            <div className="podium-card silver animate-fade" style={{ animationDelay: '0.1s' }}>
              <div className="rank-badge silver">2</div>
              <div className="avatar-circle silver-border">🥈</div>
              <div className="podium-info">
                <p className="user-name">{top3[1].name}</p>
                <p className="user-xp">{top3[1].xp} XP</p>
              </div>
            </div>
          )}
          {/* Gold - 1st */}
          {top3[0] && (
            <div className="podium-card gold animate-fade">
              <div className="rank-badge gold">1</div>
              <div className="avatar-circle gold-border">🥇</div>
              <div className="podium-info">
                <p className="user-name">{top3[0].name}</p>
                <p className="user-xp">{top3[0].xp} XP</p>
              </div>
            </div>
          )}
          {/* Bronze - 3rd */}
          {top3[2] && (
            <div className="podium-card bronze animate-fade" style={{ animationDelay: '0.2s' }}>
              <div className="rank-badge bronze">3</div>
              <div className="avatar-circle bronze-border">🥉</div>
              <div className="podium-info">
                <p className="user-name">{top3[2].name}</p>
                <p className="user-xp">{top3[2].xp} XP</p>
              </div>
            </div>
          )}
        </div>

        {/* List Section */}
        <div className="rank-list-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}>
              <div className="loader"></div>
              <p>Loading rankings...</p>
            </div>
          ) : (
            <div className="rank-list-items">
              {others.map((user, index) => (
                <div 
                  key={user.id} 
                  className="vq-card animate-fade rank-row" 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="rank-number">{index + 4}</div>
                  <div className="rank-avatar">{user.name.charAt(0)}</div>
                  <div className="rank-info">
                    <h4 className="rank-name">{user.name}</h4>
                    <p className="rank-subtitle">Grade {user.grade} Student • Active Learner</p>
                  </div>
                  <div className="rank-points">
                    <span className="points-value">{user.xp}</span>
                    <span className="points-unit">XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .leaderboard-wrapper {
          padding-top: 20px;
        }

        .leaderboard-content-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .podium-section {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 32px;
          margin-bottom: 80px;
          padding: 40px 20px;
          perspective: 1000px;
        }

        .podium-card {
          flex: 1;
          max-width: 240px;
          background: white;
          padding: 32px 20px;
          border-radius: 24px;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          transition: transform 0.3s ease;
        }

        .podium-card:hover {
          transform: translateY(-10px) scale(1.02);
        }

        .podium-card.gold {
          z-index: 2;
          padding: 48px 24px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 215, 0, 0.3);
          box-shadow: 0 25px 50px rgba(255, 215, 0, 0.15);
        }

        .podium-card.silver {
          border: 1px solid rgba(192, 192, 192, 0.3);
        }

        .podium-card.bronze {
          border: 1px solid rgba(205, 127, 50, 0.3);
        }

        .rank-badge {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: white;
          font-size: 18px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }

        .rank-badge.gold { background: linear-gradient(135deg, #FFD700, #FFA000); }
        .rank-badge.silver { background: linear-gradient(135deg, #C0C0C0, #9E9E9E); }
        .rank-badge.bronze { background: linear-gradient(135deg, #CD7F32, #A0522D); }

        .avatar-circle {
          width: 90px;
          height: 90px;
          background: white;
          border-radius: 50%;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        }

        .gold .avatar-circle { border: 6px solid #FFD700; width: 110px; height: 110px; font-size: 56px; }
        .silver .avatar-circle { border: 4px solid #C0C0C0; }
        .bronze .avatar-circle { border: 4px solid #CD7F32; }

        .podium-info .user-name {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 8px;
          color: var(--text-main);
        }

        .podium-info .user-xp {
          font-size: 24px;
          font-weight: 900;
          color: var(--green-primary);
          margin: 0;
        }

        .gold .user-xp { font-size: 32px; }

        .rank-list-container {
          max-width: 800px;
          margin: 0 auto 100px;
        }

        .rank-list-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .rank-row {
          display: flex;
          align-items: center;
          padding: 24px 32px !important;
          transition: all 0.2s ease;
        }

        .rank-row:hover {
          transform: translateX(10px);
          border-color: var(--green-primary);
        }

        .rank-number {
          font-size: 20px;
          font-weight: 900;
          color: var(--text-secondary);
          width: 48px;
          opacity: 0.5;
        }

        .rank-avatar {
          width: 56px;
          height: 56px;
          background: var(--green-bg);
          color: var(--green-primary);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 800;
          margin-right: 24px;
        }

        .rank-info {
          flex: 1;
        }

        .rank-name {
          margin: 0 0 4px;
          font-size: 18px;
          font-weight: 700;
        }

        .rank-subtitle {
          margin: 0;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .rank-points {
          text-align: right;
          background: #f8fafc;
          padding: 8px 16px;
          border-radius: 12px;
        }

        .points-value {
          font-size: 20px;
          font-weight: 900;
          color: var(--green-primary);
          margin-right: 4px;
        }

        .points-unit {
          font-size: 12px;
          font-weight: 800;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .podium-section {
            flex-direction: column;
            align-items: center;
            gap: 40px;
          }
          .podium-card {
            width: 100%;
            max-width: 320px;
          }
          .podium-card.gold {
            order: -1;
            margin-bottom: 0;
          }
          .rank-row {
            padding: 16px 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;
