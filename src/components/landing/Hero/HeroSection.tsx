import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Section } from '../shared/Section';
import { Button } from '../shared/Button';
import { AvatarGrid } from './AvatarGrid';
import './HeroSection.css';

export const HeroSection: React.FC = () => {
  return (
    <Section background="gradient" className="hero-section">
      <Container>
        <Row className="align-items-center text-center">
          <Col xs={12} className="position-relative">
            <AvatarGrid />
            <h1 className="hero-title">
              Empowering Every Decision<br />
              with Real User Voices
            </h1>
            <p className="hero-subtitle">
              Continuously align your strategies with the user voice to drive more informed and
              impactful product development decisions.
            </p>
            <div className="hero-buttons">
              <Button variant="primary" className="me-3">
                Find user videos
              </Button>
              <Button variant="secondary">
                Publish user videos
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Section>
  );
};
