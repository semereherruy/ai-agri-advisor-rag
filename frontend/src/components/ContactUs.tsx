import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactUs.css';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="card">
              <div className="contact-info-card">
                <span className="contact-info-icon">📧</span>
                <div className="contact-info-content">
                  <h3>Get in Touch</h3>
                  <p>
                    Have questions about the AI Agriculture Advisor? Want to provide feedback 
                    or report an issue? Fill out the form or reach out to us.
                  </p>
                </div>
              </div>

              <div className="contact-info-card" style={{ marginTop: '24px' }}>
                <span className="contact-info-icon">📍</span>
                <div className="contact-info-content">
                  <h3>Location</h3>
                  <p>Ethiopia (Tigray Region)</p>
                </div>
              </div>

              <div className="contact-info-card">
                <span className="contact-info-icon">🌐</span>
                <div className="contact-info-content">
                  <h3>Scope</h3>
                  <p>Ethiopia → Africa → Global</p>
                </div>
              </div>

              <div className="contact-info-card">
                <span className="contact-info-icon">🎯</span>
                <div className="contact-info-content">
                  <h3>Focus</h3>
                  <p>Teff & Maize Agriculture</p>
                </div>
              </div>
            </div>

            <div className="contact-feedback-card">
              <h3>💡 Feedback Welcome</h3>
              <p>
                Your feedback helps us improve the AI Agriculture Advisor. Whether it's 
                a bug report, feature request, or general comment, we value your input.
              </p>
            </div>
          </div>

          <div className="card contact-form-card">
            <h2 className="contact-form-title">Send us a Message</h2>
            
            {submitted ? (
              <div className="contact-form-submitted">
                <div className="contact-form-submitted-icon">✅</div>
                <h3>Thank you!</h3>
                <p>
                  Your message has been sent. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-group">
                  <label htmlFor="name" className="contact-form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="contact-form-input"
                    placeholder="Your name"
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="email" className="contact-form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="contact-form-input"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="subject" className="contact-form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="contact-form-input"
                    placeholder="What's this about?"
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="message" className="contact-form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="contact-form-textarea"
                    placeholder="Your message here..."
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="contact-actions">
          <Link to="/chat" className="btn-secondary">
            Back to Chat
          </Link>
          <Link to="/about" className="btn-secondary">
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
