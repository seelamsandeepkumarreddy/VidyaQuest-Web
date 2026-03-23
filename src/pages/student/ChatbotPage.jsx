import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import BottomNav from '../../components/BottomNav';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { text: "Namaste! I'm your VidyaQuest AI guide. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setLoading(true);

    try {
      const apiResponse = await api.askChatbot(userMsg);
      setMessages(prev => [...prev, { text: apiResponse.answer, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "I'm sorry, I'm having trouble connecting right now. Please try again later.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container-layout">
        <div className="chat-interface-card animate-fade">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <button 
                onClick={() => navigate(-1)} 
                className="chat-back-btn"
              >
                ←
              </button>
              <div className="bot-avatar-circle">🤖</div>
              <div className="bot-info-texts">
                <h3 className="bot-name">Vidya AI Guide</h3>
                <p className="bot-tagline">Academic Assistant • Always Active</p>
              </div>
            </div>
            <div className="chat-header-right">
              <div className="status-indicator">
                <span className="pulse-dot"></span> Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages-area">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`chat-bubble-row ${msg.isBot ? 'bot-row' : 'user-row'}`}
              >
                {msg.isBot && <div className="bubble-avatar-mini">🤖</div>}
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble-row bot-row loading-row">
                <div className="bubble-avatar-mini">🤖</div>
                <div className="message-bubble typing-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-footer">
            <form onSubmit={handleSend} className="chat-form-layout">
              <div className="input-group-enhanced">
                <input 
                  type="text" 
                  className="chat-main-input" 
                  placeholder="Ask about math, science, or your study progress..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || loading}
                  className="chat-send-btn"
                >
                  <span className="send-icon">➔</span>
                </button>
              </div>
            </form>
            <p className="chat-footer-note">Vidya AI may occasionally provide inaccurate info. Verify important facts.</p>
          </div>
        </div>
      </div>

      <style>{`
        .chatbot-wrapper {
          height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
        }

        .chatbot-container-layout {
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
          height: 100%;
          padding: 24px;
        }

        .chat-interface-card {
          background: white;
          border-radius: 32px;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
          overflow: hidden;
        }

        .chat-header {
          padding: 32px;
          background: var(--green-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          z-index: 10;
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .chat-back-btn {
          background: rgba(255,255,255,0.15);
          border: none;
          color: white;
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

        .chat-back-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: translateX(-4px);
        }

        .bot-avatar-circle {
          width: 64px;
          height: 64px;
          background: white;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }

        .bot-name { margin: 0; font-size: 22px; font-weight: 900; }
        .bot-tagline { margin: 4px 0 0; font-size: 13px; opacity: 0.9; font-weight: 600; }

        .status-indicator {
          background: rgba(255,255,255,0.15);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(74, 222, 128, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
          100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
        }

        .chat-messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 48px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          background: #fdfdfd;
          scroll-behavior: smooth;
        }

        .chat-bubble-row {
          display: flex;
          gap: 16px;
          max-width: 80%;
          animation: slideUp 0.4s ease-out forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bot-row { align-self: flex-start; }
        .user-row { align-self: flex-end; flex-direction: row-reverse; }

        .bubble-avatar-mini {
          width: 40px;
          height: 40px;
          background: #f1f5f9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .message-bubble {
          padding: 20px 24px;
          border-radius: 24px;
          font-size: 16px;
          line-height: 1.6;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }

        .bot-row .message-bubble {
          background: white;
          color: var(--text-main);
          border: 1px solid #f1f5f9;
          border-bottom-left-radius: 4px;
        }

        .user-row .message-bubble {
          background: var(--green-primary);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 8px 20px rgba(46, 125, 50, 0.15);
        }

        .typing-bubble {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 16px 20px;
        }

        .typing-bubble .dot {
          width: 6px;
          height: 6px;
          background: #cbd5e1;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-bubble .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-bubble .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .chat-input-footer {
          padding: 32px 48px;
          background: white;
          border-top: 1px solid #f1f5f9;
        }

        .input-group-enhanced {
          position: relative;
          display: flex;
          align-items: center;
        }

        .chat-main-input {
          width: 100%;
          padding: 24px 80px 24px 32px;
          border-radius: 24px;
          border: 2px solid #f1f5f9;
          background: #f8fafc;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
          outline: none;
        }

        .chat-main-input:focus {
          border-color: var(--green-primary);
          background: white;
          box-shadow: 0 8px 25px rgba(0,0,0,0.05);
        }

        .chat-send-btn {
          position: absolute;
          right: 12px;
          width: 60px;
          height: 60px;
          background: var(--green-primary);
          color: white;
          border: none;
          border-radius: 18px;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chat-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(46, 125, 50, 0.2);
        }

        .chat-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .chat-footer-note {
          text-align: center;
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 20px;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .chatbot-container-layout { padding: 12px; }
          .chat-header { padding: 20px; }
          .chat-messages-area { padding: 24px; }
          .chat-input-footer { padding: 20px; }
          .message-bubble { font-size: 15px; }
        }
      `}</style>
    </div>
  );
};

export default ChatbotPage;
