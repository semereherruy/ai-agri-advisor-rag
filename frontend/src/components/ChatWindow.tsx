import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Message } from './ChatPage';
import './ChatWindow.css';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onFeedback: (questionId: string, rating: number, comment?: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onFeedback, onSuggestionClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="chat-window agri-chat-bg">
      <div className="chat-window-content">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-message-icon">
              <img src="https://cdn-icons-png.flaticon.com/512/5973/5973800.png" alt="Chat" style={{ width: 48, height: 48, filter: 'drop-shadow(0 2px 8px #60A66444)' }} />
            </div>
            <h2 style={{ fontWeight: 700, color: 'var(--agri-green-900)' }}>How can I help you today?</h2>
            <p style={{ color: 'var(--agri-gray-500)' }}>Ask me anything about teff, maize, or general farming practices.</p>
            <div className="welcome-suggestions">
              <button
                onClick={() => onSuggestionClick?.("How do I plant teff?")}
                className="suggestion-chip agri-suggestion"
              >
                <img src="https://cdn-icons-png.flaticon.com/512/2909/2909765.png" alt="Teff" style={{ width: 20, height: 20, marginRight: 8 }} />
                How do I plant teff?
              </button>
              <button
                onClick={() => onSuggestionClick?.("What pests affect maize?")}
                className="suggestion-chip agri-suggestion"
              >
                <img src="https://cdn-icons-png.flaticon.com/512/616/616554.png" alt="Maize" style={{ width: 20, height: 20, marginRight: 8 }} />
                What pests affect maize?
              </button>
              <button
                onClick={() => onSuggestionClick?.("Soil fertility tips")}
                className="suggestion-chip agri-suggestion"
              >
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Soil" style={{ width: 20, height: 20, marginRight: 8 }} />
                Soil fertility tips
              </button>
            </div>
            <p className="welcome-hint" style={{ color: 'var(--agri-green-600)', fontWeight: 500 }}>💡 I support English, Amharic, and Tigrigna</p>
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onFeedback={onFeedback}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;

