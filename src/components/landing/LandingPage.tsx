import React from 'react';
import { Navbar } from './Navigation';
import { HeroSection } from './Hero';
import { FeatureCards } from './Features';
import { BenefitsSection } from './Benefits';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <HeroSection />
      <FeatureCards />
      <BenefitsSection />
    </div>
  );
};
