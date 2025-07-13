import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const Component = () => <div>Component</div>;

describe('Component', () => {
  it('should render a component', () => {
    render(<Component />);
    expect(screen.getByText('Component')).toBeInTheDocument();
  });
});