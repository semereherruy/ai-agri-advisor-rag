
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';
import agriFieldBg from '../assets/agri_field_bg.svg';

interface WelcomePageProps {
  onContinue?: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onContinue }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/chat');
    if (onContinue) onContinue();
  };

  return (
    <div className="welcome-page" style={{ position: 'relative', overflow: 'hidden' }}>
      <img
        src={agriFieldBg}
        alt="Agricultural field background"
        className="welcome-bg-svg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          objectFit: 'cover',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />
      <div className="welcome-hero" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-badge">RAG • Ethiopia</div>
        <h1 className="welcome-title">AI Agriculture Advisor</h1>
        <p className="welcome-subtitle">
          Evidence-based crop guidance for Ethiopia. Ask in English, Amharic, or Tigrigna and get answers grounded in trusted documents.
        </p>
        <div className="hero-highlights">
          <div className="highlight-pill">Teff & Maize</div>
          <div className="highlight-pill">Context-grounded</div>
          <div className="highlight-pill">Local seasons & practices</div>
        </div>
        <div className="hero-actions">
          <button onClick={handleContinue} className="btn-primary agri-cta-btn">
            <span>Start Chat</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <div className="hero-caption">Powered by Retrieval‑Augmented Generation</div>
        </div>
        <div className="hero-footnote">
          This system provides advisory information only. Consult local agricultural extension services for critical decisions.
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

