import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatWindow from './ChatWindow';
import InputBar from './InputBar';
import Toast from './Toast';
import './ChatPage.css';
import chatBg from '../assets/1.jpeg';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Source[];
  backend?: string;
  questionId?: string;
}

export interface Source {
  text: string;
  metadata: {
    crop?: string;
    topic?: string;
    source?: string;
    [key: string]: any;
  };
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Detect Ge'ez script for translation
      const hasGeEz = /[\u1200-\u137F]/.test(text);
      const translateLocal = hasGeEz;

      const response = await fetch('/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: text.trim(),
          k: 3,
          translate_local: translateLocal,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        isUser: false,
        timestamp: new Date(),
        sources: data.sources,
        backend: data.backend,
        questionId: data.question_id,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorToast('Failed to get response. Please check your connection and try again.');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (questionId: string, rating: number, comment?: string) => {
    try {
      await fetch('http://localhost:8000/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_id: questionId,
          rating,
          comment,
        }),
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="chat-page">
      <img src={chatBg} alt="Agriculture background" className="chat-bg" />
      <div className="chat-shell">
      {errorToast && (
        <Toast
          message={errorToast}
          onClose={() => setErrorToast(null)}
        />
      )}
      <ChatHeader />
      <ChatWindow 
        messages={messages} 
        isLoading={isLoading} 
        onFeedback={handleFeedback}
        onSuggestionClick={handleSuggestionClick}
      />
      <InputBar onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatPage;

