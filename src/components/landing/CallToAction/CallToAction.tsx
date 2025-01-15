import React from 'react';
import { Container } from 'react-bootstrap';
import { Section } from '../shared/Section';
import { Button } from '../shared/Button';
import './CallToAction.css';

export const CallToAction: React.FC = () => {
  return (
    <Section background="light" className="call-to-action">
      <Container className="text-center">
        <h2>
          Amplify your product development<br />
          decisions with user voices.
        </h2>
        <div className="cta-buttons">
          <Button variant="primary" className="me-3">
            Find insights
          </Button>
          <Button variant="secondary">
            Publish a study
          </Button>
        </div>
      </Container>
    </Section>
  );
};
