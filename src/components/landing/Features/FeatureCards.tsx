import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Section } from '../shared/Section';
import { FeatureCard } from './FeatureCard';
import './FeatureCards.css';

const features = [
  {
    id: 1,
    title: 'Discover User Insights',
    description: 'Access a vast library of user feedback videos to understand your users better.',
    imageSrc: '/images/discover.svg',
    imageAlt: 'Discover user insights illustration'
  },
  {
    id: 2,
    title: 'Share User Stories',
    description: 'Upload and organize user research videos to share valuable insights with your team.',
    imageSrc: '/images/share.svg',
    imageAlt: 'Share user stories illustration'
  },
  {
    id: 3,
    title: 'Make Better Decisions',
    description: 'Use real user feedback to drive product development and strategic decisions.',
    imageSrc: '/images/decide.svg',
    imageAlt: 'Make decisions illustration'
  }
];

export const FeatureCards: React.FC = () => {
  return (
    <Section background="light" className="feature-cards-section">
      <Container>
        <Row className="g-4">
          {features.map((feature) => (
            <Col key={feature.id} xs={12} md={4}>
              <FeatureCard {...feature} />
            </Col>
          ))}
        </Row>
      </Container>
    </Section>
  );
};
