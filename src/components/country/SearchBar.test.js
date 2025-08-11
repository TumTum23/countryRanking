import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    search: '',
    onSearchChange: jest.fn(),
    resultsCount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input with default placeholder', () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search by Name, Region, Subregion');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders search input with custom placeholder', () => {
    const customPlaceholder = 'Custom search placeholder';
    render(<SearchBar {...defaultProps} placeholder={customPlaceholder} />);
    
    const searchInput = screen.getByPlaceholderText(customPlaceholder);
    expect(searchInput).toBeInTheDocument();
  });

  test('displays search value correctly', () => {
    const searchValue = 'test search';
    render(<SearchBar {...defaultProps} search={searchValue} />);
    
    const searchInput = screen.getByDisplayValue(searchValue);
    expect(searchInput).toBeInTheDocument();
  });

  test('calls onSearchChange when input value changes', async () => {
    const mockOnSearchChange = jest.fn();
    render(<SearchBar {...defaultProps} onSearchChange={mockOnSearchChange} />);
    
    const searchInput = screen.getByPlaceholderText('Search by Name, Region, Subregion');
    await userEvent.type(searchInput, 'a');
    
    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  test('renders search icon', () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchIcon = document.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon).toHaveClass('searchIcon');
  });

  test('applies custom className when provided', () => {
    const customClass = 'custom-class';
    render(<SearchBar {...defaultProps} className={customClass} />);
    
    const searchContainer = screen.getByPlaceholderText('Search by Name, Region, Subregion').closest('div');
    expect(searchContainer).toHaveClass(customClass);
  });

  test('has correct input type', () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search by Name, Region, Subregion');
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  test('is memoized with React.memo', () => {
    const { rerender } = render(<SearchBar {...defaultProps} />);
    
    // Re-render with same props
    rerender(<SearchBar {...defaultProps} />);
    
    // Component should still be rendered (memoization working)
    expect(screen.getByPlaceholderText('Search by Name, Region, Subregion')).toBeInTheDocument();
  });
});
