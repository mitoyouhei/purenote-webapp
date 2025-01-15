import React from 'react';
import './Section.css';

import { SectionProps } from '../types';

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  background = 'light',
}) => {
  return (
    <section className={`section ${background} ${className}`}>
      <div className="container py-5">
        {children}
      </div>
    </section>
  );
};
