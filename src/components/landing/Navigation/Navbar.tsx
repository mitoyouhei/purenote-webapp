import React from 'react';
import { Navbar as BootstrapNavbar, Container } from 'react-bootstrap';
import { SearchBar } from './SearchBar';
import { Button } from '../shared/Button';
import './Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <BootstrapNavbar className="landing-navbar" expand="lg">
      <Container>
        <BootstrapNavbar.Brand href="/" className="d-flex align-items-center">
          <img
            src="/microsoft-logo.png"
            alt="Microsoft"
            className="microsoft-logo"
          />
          <span className="divider mx-2">|</span>
          <span className="river-text">River</span>
        </BootstrapNavbar.Brand>
        
        <div className="d-flex align-items-center flex-grow-1 justify-content-between">
          <div className="search-container mx-4 flex-grow-1">
            <SearchBar />
          </div>
          <Button variant="secondary">Sign in</Button>
        </div>
      </Container>
    </BootstrapNavbar>
  );
};
