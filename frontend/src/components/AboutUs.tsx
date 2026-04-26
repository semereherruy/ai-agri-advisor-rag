import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';
import aboutHero from '../assets/1.jpeg';

const AboutUs: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <div className="about-hero">
            <img src={aboutHero} alt="Ethiopian agriculture" className="about-hero-img" />
            <div className="about-hero-pill">Ethiopia • Agriculture • RAG</div>
          </div>
          <h1 className="about-title">About AI Agriculture Advisor</h1>
          <p className="about-subtitle">
            Empowering farmers with AI-powered agricultural knowledge
          </p>
        </div>

        <div className="about-content">
          <div className="card">
            <div className="about-section">
              <span className="about-section-icon">🌾</span>
              <div>
                <h2 className="about-section-title">Our Mission</h2>
                <p className="about-section-text">
                  AI Agriculture Advisor is designed to provide farmers with reliable, 
                  data-grounded agricultural advice. We use Retrieval-Augmented Generation (RAG) 
                  technology to answer questions based on trusted agricultural documents, ensuring 
                  accurate and helpful information for farming practices.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="about-section">
              <span className="about-section-icon">🎯</span>
              <div>
                <h2 className="about-section-title">What We Do</h2>
                <ul className="about-list">
                  <li className="about-list-item">
                    <span className="about-list-check">✓</span>
                    <span>Answer questions about Teff and Maize cultivation</span>
                  </li>
                  <li className="about-list-item">
                    <span className="about-list-check">✓</span>
                    <span>Provide advice based on FAO manuals and Ethiopian agricultural resources</span>
                  </li>
                  <li className="about-list-item">
                    <span className="about-list-check">✓</span>
                    <span>Support multiple languages: English, Amharic.</span>
                  </li>
                  <li className="about-list-item">
                    <span className="about-list-check">✓</span>
                    <span>Ground answers in trusted documents to avoid misinformation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="about-section">
              <span className="about-section-icon">🔬</span>
              <div>
                <h2 className="about-section-title">Technology</h2>
                <p className="about-section-text">
                  Our system uses advanced AI technology to retrieve relevant information from 
                  agricultural documents and generate helpful answers:
                </p>
                <div className="about-grid">
                  <div className="about-grid-item">
                    <h3 className="about-grid-title">RAG Technology</h3>
                    <p className="about-grid-text">
                      Retrieval-Augmented Generation ensures answers are based on real documents
                    </p>
                  </div>
                  <div className="about-grid-item">
                    <h3 className="about-grid-title">Multi-language Support</h3>
                    <p className="about-grid-text">
                      Automatic translation for English and Amharic questions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="about-section">
              <span className="about-section-icon">⚠️</span>
              <div>
                <h2 className="about-section-title">Important Notice</h2>
                <p className="about-section-text">
                  This system provides advisory information only. Farmers should consult local 
                  agricultural extension services for critical decisions. This is an MVP prototype 
                  designed for demonstration and research purposes.
                </p>
              </div>
            </div>
          </div>

          <div className="about-actions">
            <Link to="/chat" className="btn-primary">
              Get Started
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
