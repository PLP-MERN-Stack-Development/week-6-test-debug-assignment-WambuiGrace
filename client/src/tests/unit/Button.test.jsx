import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

describe('Button', () => {
  it('should render a button', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});