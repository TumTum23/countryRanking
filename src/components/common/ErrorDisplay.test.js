import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorDisplay from './ErrorDisplay';

describe('ErrorDisplay', () => {
  const defaultProps = {
    error: 'An error occurred',
    onRetry: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders error message', () => {
    render(<ErrorDisplay {...defaultProps} />);
    
    const errorMessage = screen.getByText('An error occurred');
    expect(errorMessage).toBeInTheDocument();
  });

  test('renders with custom error message', () => {
    const customError = 'Custom error message';
    render(<ErrorDisplay {...defaultProps} error={customError} />);
    
    const errorMessage = screen.getByText(customError);
    expect(errorMessage).toBeInTheDocument();
  });

  test('renders retry button when onRetry is provided', () => {
    render(<ErrorDisplay {...defaultProps} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  test('does not render retry button when onRetry is not provided', () => {
    const { onRetry, ...propsWithoutRetry } = defaultProps;
    render(<ErrorDisplay {...propsWithoutRetry} />);
    
    const retryButton = screen.queryByRole('button', { name: /try again/i });
    expect(retryButton).not.toBeInTheDocument();
  });

  test('calls onRetry when retry button is clicked', async () => {
    const mockOnRetry = jest.fn();
    render(<ErrorDisplay {...defaultProps} onRetry={mockOnRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await userEvent.click(retryButton);
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  test('renders error title', () => {
    render(<ErrorDisplay {...defaultProps} />);
    
    const errorTitle = screen.getByText('Error');
    expect(errorTitle).toBeInTheDocument();
    expect(errorTitle.tagName).toBe('H3');
  });

  test('renders error icon', () => {
    render(<ErrorDisplay {...defaultProps} />);
    
    const errorIcon = screen.getByText('⚠️');
    expect(errorIcon).toBeInTheDocument();
  });

  test('has correct CSS classes', () => {
    render(<ErrorDisplay {...defaultProps} />);
    
    const errorContainer = screen.getByText('Error').closest('div');
    expect(errorContainer).toHaveClass('errorDisplay');
    
    const errorMessage = screen.getByText('An error occurred');
    expect(errorMessage).toHaveClass('errorMessage');
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toHaveClass('errorRetryBtn');
  });
});
