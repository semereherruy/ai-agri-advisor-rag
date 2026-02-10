import React from 'react';
import './ChatHeader.css';

const ChatHeader: React.FC = () => {
  return (
    <div className="chat-header">
      <div className="chat-header-content">
        <div className="chat-header-icon">
          <img src="https://cdn-icons-png.flaticon.com/512/2909/2909765.png" alt="Wheat" style={{ width: 40, height: 40, filter: 'drop-shadow(0 2px 8px #60A66444)' }} />
        </div>
        <div className="chat-header-text">
          <h1 className="chat-header-title">AI Agriculture Advisor</h1>
          <p className="chat-header-subtitle">Ask me anything about farming</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

