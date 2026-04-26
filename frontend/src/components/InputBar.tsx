import React, { useState, KeyboardEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Mic, Send } from 'lucide-react';
import './InputBar.css';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, disabled }) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

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

  const toggleMic = () => {
    setIsListening(!isListening);
    // Placeholder for actual speech recognition
    console.log('Mic toggled:', !isListening);
  };

  return (
    <div className="input-bar p-4 bg-white border-t border-green-100">
      <div className="input-container flex items-center gap-2 max-w-4xl mx-auto">
        <Input
          type="text"
          placeholder="Ask about teff, maize, or farming..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMic}
          disabled={disabled}
          className={`p-2 ${isListening ? 'text-red-500' : 'text-green-600'}`}
          aria-label="Microphone"
        >
          <Mic size={20} />
        </Button>
        <Button
          onClick={handleSend}
          disabled={disabled || !inputText.trim()}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Send size={18} className="mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default InputBar;
