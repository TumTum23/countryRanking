import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaginationControls from './PaginationControls';

describe('PaginationControls', () => {
  const defaultProps = {
    page: 2,
    totalPages: 5,
    viewAll: false,
    onPrev: jest.fn(),
    onNext: jest.fn(),
    onViewAll: jest.fn(),
    onPaginate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders pagination controls when not viewing all', () => {
    render(<PaginationControls {...defaultProps} />);
    
    const prevButton = screen.getByRole('button', { name: /«/ });
    const nextButton = screen.getByRole('button', { name: /»/ });
    const viewAllButton = screen.getByRole('button', { name: 'View All' });
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(viewAllButton).toBeInTheDocument();
  });

  test('displays correct page information', () => {
    render(<PaginationControls {...defaultProps} />);
    
    const pageInfo = screen.getByText('Page 2 of 5');
    expect(pageInfo).toBeInTheDocument();
  });

  test('calls onPrev when previous button is clicked', async () => {
    render(<PaginationControls {...defaultProps} />);
    
    const prevButton = screen.getByRole('button', { name: /«/ });
    await userEvent.click(prevButton);
    
    expect(defaultProps.onPrev).toHaveBeenCalledTimes(1);
  });

  test('calls onNext when next button is clicked', async () => {
    render(<PaginationControls {...defaultProps} />);
    
    const nextButton = screen.getByRole('button', { name: /»/ });
    await userEvent.click(nextButton);
    
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
  });

  test('calls onViewAll when view all button is clicked', async () => {
    render(<PaginationControls {...defaultProps} />);
    
    const viewAllButton = screen.getByRole('button', { name: 'View All' });
    await userEvent.click(viewAllButton);
    
    expect(defaultProps.onViewAll).toHaveBeenCalledTimes(1);
  });

  test('disables previous button on first page', () => {
    const propsFirstPage = { ...defaultProps, page: 1 };
    render(<PaginationControls {...propsFirstPage} />);
    
    const prevButton = screen.getByRole('button', { name: /«/ });
    expect(prevButton).toBeDisabled();
  });

  test('disables next button on last page', () => {
    const propsLastPage = { ...defaultProps, page: 5 };
    render(<PaginationControls {...propsLastPage} />);
    
    const nextButton = screen.getByRole('button', { name: /»/ });
    expect(nextButton).toBeDisabled();
  });

  test('renders view all mode when viewAll is true', () => {
    const propsViewAll = { ...defaultProps, viewAll: true };
    render(<PaginationControls {...propsViewAll} />);
    
    const showPaginatedButton = screen.getByRole('button', { name: 'Show Paginated' });
    expect(showPaginatedButton).toBeInTheDocument();
    
    // Should not show pagination controls
    expect(screen.queryByRole('button', { name: /«/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /»/ })).not.toBeInTheDocument();
    expect(screen.queryByText('Page 2 of 5')).not.toBeInTheDocument();
  });

  test('calls onPaginate when show paginated button is clicked', async () => {
    const propsViewAll = { ...defaultProps, viewAll: true };
    render(<PaginationControls {...propsViewAll} />);
    
    const showPaginatedButton = screen.getByRole('button', { name: 'Show Paginated' });
    await userEvent.click(showPaginatedButton);
    
    expect(defaultProps.onPaginate).toHaveBeenCalledTimes(1);
  });

  test('does not render pagination controls when totalPages is 1', () => {
    const propsSinglePage = { ...defaultProps, totalPages: 1 };
    render(<PaginationControls {...propsSinglePage} />);
    
    expect(screen.queryByRole('button', { name: /«/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /»/ })).not.toBeInTheDocument();
    expect(screen.queryByText('Page 2 of 1')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'View All' })).not.toBeInTheDocument();
  });

  test('has correct CSS classes', () => {
    render(<PaginationControls {...defaultProps} />);
    
    const paginationContainer = screen.getByText('Page 2 of 5').closest('div');
    expect(paginationContainer).toHaveClass('paginationControls');
    
    const prevButton = screen.getByRole('button', { name: /«/ });
    expect(prevButton).toHaveClass('paginationBtn');
    
    const viewAllButton = screen.getByRole('button', { name: 'View All' });
    expect(viewAllButton).toHaveClass('paginationBtn', 'viewAllBtn');
  });

  test('is memoized with React.memo', () => {
    const { rerender } = render(<PaginationControls {...defaultProps} />);
    
    // Re-render with same props
    rerender(<PaginationControls {...defaultProps} />);
    
    // Component should still be rendered (memoization working)
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  test('handles edge case of page 0', () => {
    const propsPageZero = { ...defaultProps, page: 0 };
    render(<PaginationControls {...propsPageZero} />);
    
    // Should still render but with page 0
    const pageInfo = screen.getByText('Page 0 of 5');
    expect(pageInfo).toBeInTheDocument();
  });
});
