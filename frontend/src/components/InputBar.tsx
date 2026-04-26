import React, { useState, KeyboardEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import './InputBar.css';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, disabled }) => {
  const [inputText, setInputText] = useState('');

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
    <div className="input-bar p-4 bg-white border-t border-green-100">
      <div className="input-container flex items-center gap-2 w-full max-w-4xl mx-auto px-4">
        <textarea
          placeholder="Ask about teff, maize, or farming..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={disabled}
          className="w-full p-3 border border-green-100 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none min-h-[50px] max-h-[150px] text-base"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !inputText.trim()}
          className="bg-green-600 hover:bg-green-700 text-white self-end h-12"
        >
          <Send size={18} className="mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default InputBar;
