import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import './Button.css';

import { ButtonProps } from '../types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  className = '',
}) => {
  return (
    <BootstrapButton
      variant={variant}
      onClick={onClick}
      className={`custom-button ${variant} ${className}`}
    >
      {children}
    </BootstrapButton>
  );
};
