import React, { useState } from 'react';
import './FeedbackBar.css';

interface FeedbackBarProps {
  questionId: string;
  onFeedback: (questionId: string, rating: number, comment?: string) => void;
}

const FeedbackBar: React.FC<FeedbackBarProps> = ({ questionId, onFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const handleRating = async (value: number) => {
    if (feedbackGiven) return;
    
    setRating(value);
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
          👍
        </button>
        <button
          className="feedback-button"
          onClick={() => handleRating(1)}
          aria-label="Not helpful"
        >
          👎
        </button>
      </div>
    </div>
  );
};

export default FeedbackBar;

