import React from 'react';
import { render, screen } from '@testing-library/react';
import CountryHeader from './CountryHeader';

describe('CountryHeader', () => {
  const mockCountry = {
    name: {
      common: 'United States'
    },
    flags: {
      svg: 'https://flagcdn.com/us.svg'
    }
  };

  test('renders country header when country is provided', () => {
    render(<CountryHeader country={mockCountry} />);
    
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByAltText('United States flag')).toBeInTheDocument();
  });

  test('renders flag with correct attributes', () => {
    render(<CountryHeader country={mockCountry} />);
    
    const flagImage = screen.getByAltText('United States flag');
    expect(flagImage).toHaveAttribute('src', 'https://flagcdn.com/us.svg');
    expect(flagImage).toHaveAttribute('alt', 'United States flag');
  });

  test('renders nothing when country is null', () => {
    const { container } = render(<CountryHeader country={null} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('renders nothing when country is undefined', () => {
    const { container } = render(<CountryHeader country={undefined} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('handles country without flags', () => {
    const countryWithoutFlags = {
      ...mockCountry,
      flags: null
    };
    
    render(<CountryHeader country={countryWithoutFlags} />);
    
    // Should still render the header, just without flag image
    expect(screen.getByText('United States')).toBeInTheDocument();
    
    // The img element should exist but have no src attribute
    const flagImage = screen.getByAltText('United States flag');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).not.toHaveAttribute('src');
  });

  test('handles country with undefined flags', () => {
    const countryWithUndefinedFlags = {
      ...mockCountry,
      flags: undefined
    };
    
    render(<CountryHeader country={countryWithUndefinedFlags} />);
    
    // Should still render the header, just without flag image
    expect(screen.getByText('United States')).toBeInTheDocument();
    
    // The img element should exist but have no src attribute
    const flagImage = screen.getByAltText('United States flag');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).not.toHaveAttribute('src');
  });

  test('handles country with empty flags object', () => {
    const countryWithEmptyFlags = {
      ...mockCountry,
      flags: {}
    };
    
    render(<CountryHeader country={countryWithEmptyFlags} />);
    
    // Should still render the header, just without flag image
    expect(screen.getByText('United States')).toBeInTheDocument();
    
    // The img element should exist but have no src attribute
    const flagImage = screen.getByAltText('United States flag');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).not.toHaveAttribute('src');
  });

  test('handles country with different name format', () => {
    const countryWithDifferentName = {
      name: {
        common: 'South Africa'
      },
      flags: {
        svg: 'https://flagcdn.com/za.svg'
      }
    };
    
    render(<CountryHeader country={countryWithDifferentName} />);
    
    expect(screen.getByText('South Africa')).toBeInTheDocument();
    expect(screen.getByAltText('South Africa flag')).toBeInTheDocument();
  });

  test('has correct CSS class', () => {
    render(<CountryHeader country={mockCountry} />);
    
    const headerContainer = screen.getByText('United States').closest('div');
    expect(headerContainer).toHaveClass('countryDetailHeader');
  });

  test('flag has correct styling attributes', () => {
    render(<CountryHeader country={mockCountry} />);
    
    const flagImage = screen.getByAltText('United States flag');
    
    // Check inline styles
    expect(flagImage).toHaveStyle({
      width: '72px',
      height: '48px',
      objectFit: 'cover',
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    });
  });

  test('renders h2 element for country name', () => {
    render(<CountryHeader country={mockCountry} />);
    
    const countryName = screen.getByRole('heading', { level: 2 });
    expect(countryName).toBeInTheDocument();
    expect(countryName).toHaveTextContent('United States');
  });
});
