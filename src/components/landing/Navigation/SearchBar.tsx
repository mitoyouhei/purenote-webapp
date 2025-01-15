import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import './SearchBar.css';

export const SearchBar: React.FC = () => {
  return (
    <InputGroup className="search-bar">
      <InputGroup.Text>
        <HiMagnifyingGlass />
      </InputGroup.Text>
      <Form.Control
        placeholder="Search video insights"
        aria-label="Search video insights"
      />
    </InputGroup>
  );
};
