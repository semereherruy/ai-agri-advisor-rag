import React from 'react';
import SourcesPanel from './SourcesPanel';
import FeedbackBar from './FeedbackBar';
import { Message } from './ChatPage.types';
import { Card, CardContent } from './ui/card';
import './MessageBubble.css';

interface MessageBubbleProps {
  message: Message;
  onFeedback: (questionId: string, rating: number, comment?: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onFeedback }) => {

  if (message.isUser) {
    return (
      <div className="message-bubble message-bubble-user">
        <div className="message-content">{message.text}</div>
      </div>
    );
  }

  // Assistant message rendered inside a Card with fade‑in animation
  return (
    <Card className="mb-4 animate-fadeIn shadow-sm">
      <CardContent className="p-4">
        <div className="message-bubble message-bubble-assistant">
          <div className="message-content">{message.text}</div>
          {message.backend && (
            <div className="message-backend">Backend: {message.backend}</div>
          )}
          {message.sources && message.sources.length > 0 && (
            <SourcesPanel
              sources={message.sources}
              isOpen={false}
              onToggle={() => {}}
            />
          )}
          {message.questionId && (
            <FeedbackBar
              questionId={message.questionId}
              onFeedback={onFeedback}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );

};

export default MessageBubble;

