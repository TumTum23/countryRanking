import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CountryTable from './CountryTable';

describe('CountryTable', () => {
  const mockCountries = [
    {
      cca3: 'USA',
      name: { common: 'United States' },
      population: 331002651,
      area: 9833517,
      region: 'Americas',
      flags: { svg: 'https://flagcdn.com/us.svg' }
    },
    {
      cca3: 'CAN',
      name: { common: 'Canada' },
      population: 37742154,
      area: 9984670,
      region: 'Americas',
      flags: { svg: 'https://flagcdn.com/ca.svg' }
    },
    {
      cca3: 'MEX',
      name: { common: 'Mexico' },
      population: 128932753,
      area: 1964375,
      region: 'Americas',
      flags: { svg: 'https://flagcdn.com/mx.svg' }
    }
  ];

  const defaultProps = {
    countries: mockCountries,
    onRowClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders table with correct headers', () => {
    render(<CountryTable {...defaultProps} />);
    
    expect(screen.getByText('Flag')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Population')).toBeInTheDocument();
    expect(screen.getByText('Area (km²)')).toBeInTheDocument();
    expect(screen.getByText('Region')).toBeInTheDocument();
  });

  test('renders all country rows', () => {
    render(<CountryTable {...defaultProps} />);
    
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
  });

  test('displays population with proper formatting', () => {
    render(<CountryTable {...defaultProps} />);
    
    expect(screen.getByText('331,002,651')).toBeInTheDocument();
    expect(screen.getByText('37,742,154')).toBeInTheDocument();
    expect(screen.getByText('128,932,753')).toBeInTheDocument();
  });

  test('displays area with proper formatting', () => {
    render(<CountryTable {...defaultProps} />);
    
    expect(screen.getByText('9,833,517')).toBeInTheDocument();
    expect(screen.getByText('9,984,670')).toBeInTheDocument();
    expect(screen.getByText('1,964,375')).toBeInTheDocument();
  });

  test('displays region information', () => {
    render(<CountryTable {...defaultProps} />);
    
    const americasElements = screen.getAllByText('Americas');
    expect(americasElements).toHaveLength(3);
    expect(americasElements[0]).toBeInTheDocument();
  });

  test('renders country flags', () => {
    render(<CountryTable {...defaultProps} />);
    
    const flagImages = screen.getAllByAltText(/flag$/);
    expect(flagImages).toHaveLength(3);
    
    flagImages.forEach((img, index) => {
      expect(img).toHaveAttribute('src', mockCountries[index].flags.svg);
      expect(img).toHaveAttribute('alt', `${mockCountries[index].name.common} flag`);
    });
  });

  test('calls onRowClick when row is clicked', async () => {
    render(<CountryTable {...defaultProps} />);
    
    const firstRow = screen.getByText('United States').closest('tr');
    await userEvent.click(firstRow);
    
    expect(defaultProps.onRowClick).toHaveBeenCalledWith('USA');
  });

  test('calls onRowClick with correct country code for each row', async () => {
    render(<CountryTable {...defaultProps} />);
    
    const canadaRow = screen.getByText('Canada').closest('tr');
    await userEvent.click(canadaRow);
    
    expect(defaultProps.onRowClick).toHaveBeenCalledWith('CAN');
  });

  test('has correct CSS classes', () => {
    render(<CountryTable {...defaultProps} />);
    
    const tableWrapper = screen.getByText('Flag').closest('div');
    expect(tableWrapper).toHaveClass('countryTableWrapper');
    
    const table = screen.getByRole('table');
    expect(table).toHaveClass('countryTable');
    
    const rows = screen.getAllByRole('row');
    // Header row + 3 data rows
    expect(rows).toHaveLength(4);
    
    // Check that data rows have clickable class
    const dataRows = rows.slice(1); // Skip header row
    dataRows.forEach(row => {
      expect(row).toHaveClass('clickableRow');
    });
  });

  test('has correct table structure', () => {
    render(<CountryTable {...defaultProps} />);
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    const thead = table.querySelector('thead');
    expect(thead).toBeInTheDocument();
    
    const tbody = table.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
  });

  test('handles empty countries array', () => {
    const propsWithNoCountries = {
      ...defaultProps,
      countries: [],
    };
    
    render(<CountryTable {...propsWithNoCountries} />);
    
    // Should still render headers
    expect(screen.getByText('Flag')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    
    // Should not render any country data
    expect(screen.queryByText('United States')).not.toBeInTheDocument();
    expect(screen.queryByText('Canada')).not.toBeInTheDocument();
  });

  test('handles country without area', () => {
    const countriesWithoutArea = [
      {
        ...mockCountries[0],
        area: null
      }
    ];
    
    const propsWithoutArea = {
      ...defaultProps,
      countries: countriesWithoutArea,
    };
    
    render(<CountryTable {...propsWithoutArea} />);
    
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('handles country without flags', () => {
    const countriesWithoutFlags = [
      {
        ...mockCountries[0],
        flags: null
      }
    ];
    
    const propsWithoutFlags = {
      ...defaultProps,
      countries: countriesWithoutFlags,
    };
    
    render(<CountryTable {...propsWithoutFlags} />);
    
    // Should still render the row, just without flag image
    expect(screen.getByText('United States')).toBeInTheDocument();
    // The img element still exists but has no src attribute
    const flagImage = screen.getByAltText('United States flag');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).not.toHaveAttribute('src');
  });

  test('is memoized with React.memo', () => {
    const { rerender } = render(<CountryTable {...defaultProps} />);
    
    // Re-render with same props
    rerender(<CountryTable {...defaultProps} />);
    
    // Component should still be rendered (memoization working)
    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  test('has pointer cursor on rows', () => {
    render(<CountryTable {...defaultProps} />);
    
    const rows = screen.getAllByRole('row');
    const dataRows = rows.slice(1); // Skip header row
    
    dataRows.forEach(row => {
      expect(row).toHaveStyle({ cursor: 'pointer' });
    });
  });
});
