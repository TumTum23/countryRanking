import React from 'react';
import { render, screen } from '@testing-library/react';
import CountryInfo from './CountryInfo';

describe('CountryInfo', () => {
  const mockCountry = {
    population: 331002651,
    area: 9833517,
    capital: ['Washington, D.C.'],
    region: 'Americas',
    subregion: 'North America',
    unMember: true,
    independent: true
  };

  test('renders country information when country is provided', () => {
    render(<CountryInfo country={mockCountry} />);
    
    expect(screen.getByText('Population:')).toBeInTheDocument();
    expect(screen.getByText('Area:')).toBeInTheDocument();
    expect(screen.getByText('Capital:')).toBeInTheDocument();
    expect(screen.getByText('Region:')).toBeInTheDocument();
    expect(screen.getByText('Subregion:')).toBeInTheDocument();
    expect(screen.getByText('Member of UN:')).toBeInTheDocument();
    expect(screen.getByText('Independent:')).toBeInTheDocument();
  });

  test('displays population with proper formatting', () => {
    render(<CountryInfo country={mockCountry} />);
    
    expect(screen.getByText('331,002,651')).toBeInTheDocument();
  });

  test('displays area with proper formatting', () => {
    render(<CountryInfo country={mockCountry} />);
    
    expect(screen.getByText('9,833,517 km²')).toBeInTheDocument();
  });

  test('displays capital information', () => {
    render(<CountryInfo country={mockCountry} />);
    
    expect(screen.getByText('Washington, D.C.')).toBeInTheDocument();
  });

  test('displays region information', () => {
    render(<CountryInfo country={mockCountry} />);
    
    expect(screen.getByText('Americas')).toBeInTheDocument();
  });

  test('displays subregion information', () => {
    render(<CountryInfo country={mockCountry} />);
    
    expect(screen.getByText('North America')).toBeInTheDocument();
  });

  test('displays UN membership status', () => {
    render(<CountryInfo country={mockCountry} />);
    
    // Use getAllByText since there are multiple "Yes" elements
    const yesElements = screen.getAllByText('Yes');
    expect(yesElements.length).toBeGreaterThan(0);
    
    // Check that the UN membership section contains "Yes"
    const unMemberSection = screen.getByText('Member of UN:').closest('div');
    expect(unMemberSection).toHaveTextContent('Yes');
  });

  test('displays independence status', () => {
    render(<CountryInfo country={mockCountry} />);
    
    // Use getAllByText since there are multiple "Yes" elements
    const yesElements = screen.getAllByText('Yes');
    expect(yesElements.length).toBeGreaterThan(0);
    
    // Check that the Independent section contains "Yes"
    const independentSection = screen.getByText('Independent:').closest('div');
    expect(independentSection).toHaveTextContent('Yes');
  });

  test('handles multiple capitals', () => {
    const countryWithMultipleCapitals = {
      ...mockCountry,
      capital: ['Pretoria', 'Bloemfontein', 'Cape Town']
    };
    
    render(<CountryInfo country={countryWithMultipleCapitals} />);
    
    expect(screen.getByText('Pretoria, Bloemfontein, Cape Town')).toBeInTheDocument();
  });

  test('handles missing population', () => {
    const countryWithoutPopulation = {
      ...mockCountry,
      population: null
    };
    
    render(<CountryInfo country={countryWithoutPopulation} />);
    
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('handles missing area', () => {
    const countryWithoutArea = {
      ...mockCountry,
      area: null
    };
    
    render(<CountryInfo country={countryWithoutArea} />);
    
    expect(screen.getByText('- km²')).toBeInTheDocument();
  });

  test('handles missing capital', () => {
    const countryWithoutCapital = {
      ...mockCountry,
      capital: null
    };
    
    render(<CountryInfo country={countryWithoutCapital} />);
    
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('handles missing region', () => {
    const countryWithoutRegion = {
      ...mockCountry,
      region: null
    };
    
    render(<CountryInfo country={countryWithoutRegion} />);
    
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('handles missing subregion', () => {
    const countryWithoutSubregion = {
      ...mockCountry,
      subregion: null
    };
    
    render(<CountryInfo country={countryWithoutSubregion} />);
    
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('handles UN membership false', () => {
    const countryNotUNMember = {
      ...mockCountry,
      unMember: false
    };
    
    render(<CountryInfo country={countryNotUNMember} />);
    
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  test('handles independence false', () => {
    const countryNotIndependent = {
      ...mockCountry,
      independent: false
    };
    
    render(<CountryInfo country={countryNotIndependent} />);
    
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  test('handles undefined country values', () => {
    const countryWithUndefinedValues = {
      ...mockCountry,
      population: undefined,
      area: undefined,
      capital: undefined,
      region: undefined,
      subregion: undefined,
      unMember: undefined,
      independent: undefined
    };
    
    render(<CountryInfo country={countryWithUndefinedValues} />);
    
    // Should display '-' for population, capital, region, subregion
    const dashElements = screen.getAllByText('-');
    expect(dashElements).toHaveLength(4);
    
    // Area shows "- km²" when undefined
    expect(screen.getByText('- km²')).toBeInTheDocument();
    
    // Check that boolean values show "No" when undefined
    const noElements = screen.getAllByText('No');
    expect(noElements).toHaveLength(2); // Both UN membership and Independent show "No"
    
    // Verify both sections contain "No"
    const unMemberSection = screen.getByText('Member of UN:').closest('div');
    const independentSection = screen.getByText('Independent:').closest('div');
    expect(unMemberSection).toHaveTextContent('No');
    expect(independentSection).toHaveTextContent('No');
  });

  test('handles empty capital array', () => {
    const countryWithEmptyCapital = {
      ...mockCountry,
      capital: []
    };
    
    render(<CountryInfo country={countryWithEmptyCapital} />);
    
    // Empty array should render empty string, not dash
    const capitalSection = screen.getByText('Capital:').closest('div');
    expect(capitalSection).toHaveTextContent('Capital:');
    expect(capitalSection).not.toHaveTextContent('-');
  });

  test('renders nothing when country is null', () => {
    const { container } = render(<CountryInfo country={null} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('renders nothing when country is undefined', () => {
    const { container } = render(<CountryInfo country={undefined} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('has correct CSS class', () => {
    render(<CountryInfo country={mockCountry} />);
    
    // The countryDetailInfo class is on the outer container
    const infoContainer = screen.getByText('Population:').closest('.countryDetailInfo');
    expect(infoContainer).toHaveClass('countryDetailInfo');
  });

  test('displays all information in correct structure', () => {
    render(<CountryInfo country={mockCountry} />);
    
    const infoContainer = screen.getByText('Population:').closest('.countryDetailInfo');
    const infoItems = infoContainer.querySelectorAll('div > div');
    
    // Should have 7 info items (each info row is a div)
    expect(infoItems).toHaveLength(7);
    
    // Check that each item contains the expected text
    expect(infoItems[0]).toHaveTextContent('Population:');
    expect(infoItems[1]).toHaveTextContent('Area:');
    expect(infoItems[2]).toHaveTextContent('Capital:');
    expect(infoItems[3]).toHaveTextContent('Region:');
    expect(infoItems[4]).toHaveTextContent('Subregion:');
    expect(infoItems[5]).toHaveTextContent('Member of UN:');
    expect(infoItems[6]).toHaveTextContent('Independent:');
  });
});
