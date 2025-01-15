import React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="landing-footer">
      <Container>
        <div className="footer-content">
          <div className="footer-links">
            <a href="/privacy">Privacy and cookies</a>
            <a href="/legal">Legal</a>
            <a href="/help">Help</a>
            <a href="/feedback">Feedback</a>
          </div>
          <div className="copyright">
            © 2024 Microsoft
          </div>
        </div>
      </Container>
    </footer>
  );
};
