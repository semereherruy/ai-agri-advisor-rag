import React, { useState, KeyboardEvent } from 'react';
import './InputBar.css';
import './InputBar.css';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, disabled }) => {
  const [inputText, setInputText] = useState('');
  const [isPressed, setIsPressed] = useState(false);

  const handleSend = () => {
    if (inputText.trim() && !disabled) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-bar">
      <div className="input-container">
        <input
          type="text"
          className="input-field"
          placeholder="Ask about teff, maize, or farming..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        <button
          className="mic-button"
          aria-label="Microphone (placeholder)"
          disabled={disabled}
        >
          🎤
        </button>
        <button
          className={`send-button ${isPressed ? 'pressed' : ''}`}
          onClick={handleSend}
          disabled={disabled || !inputText.trim()}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          aria-label="Send message"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InputBar;

