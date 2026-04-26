import React, { useState } from 'react';
import { Message } from './ChatPage.types';
import ChatWindow from './ChatWindow';
import InputBar from './InputBar';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Leaf, X } from 'lucide-react';
import './ChatPage.css';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const hasGeEz = /[\u1200-\u137F]/.test(text);
      const translateLocal = hasGeEz;

      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text.trim(),
          k: 3,
          translate_local: translateLocal,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: questionId, rating, comment }),
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg text-2xl">
            <Leaf size={24} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-900">AgriRAG Advisor</h1>
            <p className="text-sm text-green-600">AI-powered agricultural insights for Ethiopian farmers</p>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b border-green-100">
            <CardTitle className="flex items-center gap-2">
              <span className="text-green-600">🌱</span>
              Agricultural Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onFeedback={handleFeedback}
              onSuggestionClick={handleSuggestionClick}
            />
          </CardContent>
        </Card>

        {/* Input Area */}
        <InputBar onSendMessage={handleSendMessage} disabled={isLoading} />
      </main>

      {/* Toast Notification */}
      {errorToast && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span>{errorToast}</span>
            <button onClick={() => setErrorToast(null)} className="ml-4 text-red-500 hover:text-red-700">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
