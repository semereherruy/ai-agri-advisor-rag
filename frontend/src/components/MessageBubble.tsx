import React, { useState } from 'react';
import SourcesPanel from './SourcesPanel';
import FeedbackBar from './FeedbackBar';
import { Message } from './ChatPage';
import './MessageBubble.css';
import './MessageBubble.css';

interface MessageBubbleProps {
  message: Message;
  onFeedback: (questionId: string, rating: number, comment?: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onFeedback }) => {
  const [showSources, setShowSources] = useState(false);

  if (message.isUser) {
    return (
      <div className="message-bubble message-bubble-user">
        <div className="message-content">{message.text}</div>
      </div>
    );
  }

  return (
    <div className="message-bubble message-bubble-assistant">
      <div className="message-content">{message.text}</div>
      {message.backend && (
        <div className="message-backend">Backend: {message.backend}</div>
      )}
      {message.sources && message.sources.length > 0 && (
        <SourcesPanel
          sources={message.sources}
          isOpen={showSources}
          onToggle={() => setShowSources(!showSources)}
        />
      )}
      {message.questionId && (
        <FeedbackBar
          questionId={message.questionId}
          onFeedback={onFeedback}
        />
      )}
    </div>
  );
};

export default MessageBubble;

