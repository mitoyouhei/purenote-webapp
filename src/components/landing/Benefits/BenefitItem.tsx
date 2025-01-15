import React from 'react';
import { Col } from 'react-bootstrap';
import './BenefitItem.css';

import { BenefitItemProps } from '../types';

export const BenefitItem: React.FC<BenefitItemProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Col xs={12} md={4} className="benefit-item">
      <div className="benefit-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Col>
  );
};
