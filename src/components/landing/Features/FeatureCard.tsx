import React from 'react';
import { Card } from 'react-bootstrap';
import './FeatureCard.css';

import { FeatureCardProps } from '../types';

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
}) => {
  return (
    <Card className="feature-card">
      <div className="feature-image-container">
        <Card.Img variant="top" src={imageSrc} alt={imageAlt} />
      </div>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
};
