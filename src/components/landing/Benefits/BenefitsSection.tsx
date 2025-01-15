import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Section } from '../shared/Section';
import { BenefitItem } from './BenefitItem';
import { HiMagnifyingGlass, HiPuzzlePiece, HiSparkles } from 'react-icons/hi2';
import './BenefitsSection.css';

const benefits = [
  {
    id: 1,
    icon: <HiMagnifyingGlass />,
    title: 'Simplified search and filtering',
    description: 'Find relevant user feedback quickly with powerful search and filtering capabilities.'
  },
  {
    id: 2,
    icon: <HiPuzzlePiece />,
    title: 'Integrated tools',
    description: 'Seamlessly integrate with your existing workflow and collaboration tools.'
  },
  {
    id: 3,
    icon: <HiSparkles />,
    title: 'AI-powered summaries',
    description: 'Get instant insights with AI-generated summaries of user feedback videos.'
  }
];

export const BenefitsSection: React.FC = () => {
  return (
    <Section background="gradient" className="benefits-section">
      <Container>
        <div className="text-center mb-5">
          <h2>The benefits of using River</h2>
          <p className="benefits-description">
            Streamline your user research process and make data-driven decisions
            with our comprehensive platform.
          </p>
        </div>
        <Row>
          {benefits.map((benefit) => (
            <BenefitItem key={benefit.id} {...benefit} />
          ))}
        </Row>
      </Container>
    </Section>
  );
};
