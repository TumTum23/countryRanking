import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders loading spinner with default message', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByText('Loading...');
    expect(spinner).toBeInTheDocument();
  });

  test('renders with custom message', () => {
    const customMessage = 'Custom loading message';
    render(<LoadingSpinner message={customMessage} />);
    
    const spinner = screen.getByText(customMessage);
    expect(spinner).toBeInTheDocument();
  });

  test('renders spinner container', () => {
    render(<LoadingSpinner />);
    
    const spinnerContainer = screen.getByText('Loading...').closest('div');
    expect(spinnerContainer).toHaveClass('loadingSpinner');
  });

  test('renders spinner animation element', () => {
    render(<LoadingSpinner />);
    
    const spinnerElement = document.querySelector('.spinner');
    expect(spinnerElement).toBeInTheDocument();
  });

  test('renders loading message paragraph', () => {
    render(<LoadingSpinner />);
    
    const messageElement = screen.getByText('Loading...');
    expect(messageElement.tagName).toBe('P');
    expect(messageElement).toHaveClass('loadingMessage');
  });
});
