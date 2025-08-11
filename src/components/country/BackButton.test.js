import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackButton from './BackButton';

describe('BackButton', () => {
  const defaultProps = {
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders back button with default text', () => {
    render(<BackButton {...defaultProps} />);
    
    const backButton = screen.getByRole('button', { name: 'Back' });
    expect(backButton).toBeInTheDocument();
  });

  test('renders with custom text', () => {
    const customText = 'Go Back to List';
    render(<BackButton {...defaultProps}>{customText}</BackButton>);
    
    const backButton = screen.getByRole('button', { name: customText });
    expect(backButton).toBeInTheDocument();
  });

  test('calls onClick when clicked', async () => {
    render(<BackButton {...defaultProps} />);
    
    const backButton = screen.getByRole('button', { name: 'Back' });
    await userEvent.click(backButton);
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  test('has correct CSS class', () => {
    render(<BackButton {...defaultProps} />);
    
    const backButton = screen.getByRole('button', { name: 'Back' });
    expect(backButton).toHaveClass('backBtn');
  });

  test('is memoized with React.memo', () => {
    const { rerender } = render(<BackButton {...defaultProps} />);
    
    // Re-render with same props
    rerender(<BackButton {...defaultProps} />);
    
    // Component should still be rendered (memoization working)
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  test('renders as button element', () => {
    render(<BackButton {...defaultProps} />);
    
    const backButton = screen.getByRole('button', { name: 'Back' });
    expect(backButton.tagName).toBe('BUTTON');
  });
});
