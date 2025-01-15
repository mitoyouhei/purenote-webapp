import { ReactNode } from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'light' | 'gradient';
}

export interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export interface BenefitItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}
