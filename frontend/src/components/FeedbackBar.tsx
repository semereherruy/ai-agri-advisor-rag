import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import './FeedbackBar.css';

interface FeedbackBarProps {
  questionId: string;
  onFeedback: (questionId: string, rating: number, comment?: string) => void;
}

const FeedbackBar: React.FC<FeedbackBarProps> = ({ questionId, onFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleRating = async (value: number) => {
    if (feedbackGiven) return;
    
    setFeedbackGiven(true);
    await onFeedback(questionId, value);
  };

  if (feedbackGiven) {
    return (
      <div className="feedback-bar feedback-given">
        <span>Thank you for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="feedback-bar">
      <span className="feedback-label">Was this helpful?</span>
      <div className="feedback-buttons">
        <button
          className="feedback-button"
          onClick={() => handleRating(5)}
          aria-label="Helpful"
        >
          <ThumbsUp size={18} />
        </button>
        <button
          className="feedback-button"
          onClick={() => handleRating(1)}
          aria-label="Not helpful"
        >
          <ThumbsDown size={18} />
        </button>
      </div>
    </div>
  );
};

export default FeedbackBar;
