import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CountryDetail from './CountryDetail';
import { useCountryDetail } from './hooks';

// Mock the custom hook
jest.mock('./hooks', () => ({
  useCountryDetail: jest.fn()
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ countryCode: 'USA' }),
  useNavigate: () => mockNavigate
}));

// Mock components
jest.mock('./components/country', () => ({
  BackButton: ({ onClick }) => (
    <button onClick={onClick} data-testid="back-button">Back</button>
  ),
  CountryHeader: ({ country }) => (
    <div data-testid="country-header">
      <h1>{country.name.common}</h1>
      <img src={country.flags?.svg} alt={`${country.name.common} flag`} />
    </div>
  ),
  CountryInfo: ({ country }) => (
    <div data-testid="country-info">
      <div>Population: {country.population}</div>
      <div>Capital: {country.capital?.[0] || 'N/A'}</div>
      <div>Region: {country.region}</div>
    </div>
  ),
  NeighborList: ({ neighbors, onNeighborClick }) => (
    <div data-testid="neighbor-list">
      <h3>Neighbors</h3>
      {neighbors && neighbors.length > 0 ? (
        neighbors.map((neighbor, index) => (
          <button
            key={neighbor.cca3}
            onClick={() => onNeighborClick(neighbor.cca3)}
            data-testid={`neighbor-${index}`}
          >
            {neighbor.name.common}
          </button>
        ))
      ) : (
        <span>No neighbors</span>
      )}
    </div>
  )
}));

jest.mock('./components/common', () => ({
  LoadingSpinner: ({ message }) => <div data-testid="loading-spinner">{message}</div>,
  ErrorDisplay: ({ error, onRetry }) => (
    <div data-testid="error-display">
      <span>{error}</span>
      <button onClick={onRetry} data-testid="retry-button">Retry</button>
    </div>
  )
}));

const mockCountry = {
  cca3: 'USA',
  name: { common: 'United States' },
  population: 331002651,
  capital: ['Washington, D.C.'],
  region: 'Americas',
  flags: { svg: 'https://flagcdn.com/us.svg' }
};

const mockNeighbors = [
  { cca3: 'CAN', name: { common: 'Canada' } },
  { cca3: 'MEX', name: { common: 'Mexico' } }
];

const defaultMockHook = {
  country: mockCountry,
  neighbors: mockNeighbors,
  loading: false,
  error: null,
  refetch: jest.fn()
};

const renderCountryDetail = () => {
  return render(
    <BrowserRouter>
      <CountryDetail />
    </BrowserRouter>
  );
};

describe('CountryDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    
    // Set up default mock implementation
    useCountryDetail.mockReturnValue(defaultMockHook);
  });

  describe('Rendering', () => {
    it('should render the main structure', () => {
      renderCountryDetail();
      
      expect(screen.getByTestId('country-header')).toBeInTheDocument();
      expect(screen.getByTestId('country-info')).toBeInTheDocument();
      expect(screen.getByTestId('neighbor-list')).toBeInTheDocument();
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
    });

    it('should render country header with correct data', () => {
      renderCountryDetail();
      
      expect(screen.getByText('United States')).toBeInTheDocument();
      const flagImage = screen.getByAltText('United States flag');
      expect(flagImage).toHaveAttribute('src', 'https://flagcdn.com/us.svg');
    });

    it('should render country info with correct data', () => {
      renderCountryDetail();
      
      expect(screen.getByText('Population: 331002651')).toBeInTheDocument();
      expect(screen.getByText('Capital: Washington, D.C.')).toBeInTheDocument();
      expect(screen.getByText('Region: Americas')).toBeInTheDocument();
    });

    it('should render neighbor list with correct data', () => {
      renderCountryDetail();
      
      expect(screen.getByText('Neighbors')).toBeInTheDocument();
      expect(screen.getByTestId('neighbor-0')).toBeInTheDocument();
      expect(screen.getByTestId('neighbor-1')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      useCountryDetail.mockReturnValue({
        ...defaultMockHook,
        loading: true
      });

      renderCountryDetail();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading country details...')).toBeInTheDocument();
      expect(screen.queryByTestId('country-header')).not.toBeInTheDocument();
      expect(screen.queryByTestId('country-info')).not.toBeInTheDocument();
      expect(screen.queryByTestId('neighbor-list')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error display when there is an error', () => {
      useCountryDetail.mockReturnValue({
        ...defaultMockHook,
        error: 'Failed to fetch country details'
      });

      renderCountryDetail();
      
      expect(screen.getByTestId('error-display')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch country details')).toBeInTheDocument();
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
      expect(screen.queryByTestId('country-header')).not.toBeInTheDocument();
      expect(screen.queryByTestId('country-info')).not.toBeInTheDocument();
      expect(screen.queryByTestId('neighbor-list')).not.toBeInTheDocument();
    });

    it('should call refetch when retry button is clicked', () => {
      const mockRefetch = jest.fn();
      useCountryDetail.mockReturnValue({
        ...defaultMockHook,
        error: 'Failed to fetch country details',
        refetch: mockRefetch
      });

      renderCountryDetail();
      
      fireEvent.click(screen.getByTestId('retry-button'));
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('No Country State', () => {
    it('should not render country content when country is null', () => {
      useCountryDetail.mockReturnValue({
        ...defaultMockHook,
        country: null
      });

      renderCountryDetail();
      
      expect(screen.queryByTestId('country-header')).not.toBeInTheDocument();
      expect(screen.queryByTestId('country-info')).not.toBeInTheDocument();
      expect(screen.queryByTestId('neighbor-list')).not.toBeInTheDocument();
    });

    it('should not render country content when country is undefined', () => {
      useCountryDetail.mockReturnValue({
        ...defaultMockHook,
        country: undefined
      });

      renderCountryDetail();
      
      expect(screen.queryByTestId('country-header')).not.toBeInTheDocument();
      expect(screen.queryByTestId('country-info')).not.toBeInTheDocument();
      expect(screen.queryByTestId('neighbor-list')).not.toBeInTheDocument();
    });
  });

  describe('Neighbor Interactions', () => {
    it('should call navigate when neighbor is clicked', () => {
      renderCountryDetail();
      
      const firstNeighbor = screen.getByTestId('neighbor-0');
      fireEvent.click(firstNeighbor);
      
      expect(mockNavigate).toHaveBeenCalledWith('/country/CAN');
    });

    it('should call navigate when second neighbor is clicked', () => {
      renderCountryDetail();
      
      const secondNeighbor = screen.getByTestId('neighbor-1');
      fireEvent.click(secondNeighbor);
      
      expect(mockNavigate).toHaveBeenCalledWith('/country/MEX');
    });
  });

  describe('Back Button Interactions', () => {
    it('should call navigate to home when back button is clicked', () => {
      renderCountryDetail();
      
      const backButton = screen.getByTestId('back-button');
      fireEvent.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Empty Neighbors', () => {
    it('should show "No neighbors" when neighbors array is empty', () => {
      useCountryDetail.mockReturnValue({
        ...defaultMockHook,
        neighbors: []
      });

      renderCountryDetail();
      
      expect(screen.getByText('No neighbors')).toBeInTheDocument();
      expect(screen.queryByTestId('neighbor-0')).not.toBeInTheDocument();
    });

    it('should show "No neighbors" when neighbors is null', () => {
      useCountryDetail.mockReturnValue({
        ...defaultMockHook,
        neighbors: null
      });

      renderCountryDetail();
      
      expect(screen.getByText('No neighbors')).toBeInTheDocument();
      expect(screen.queryByTestId('neighbor-0')).not.toBeInTheDocument();
    });

    it('should show "No neighbors" when neighbors is undefined', () => {
      useCountryDetail.mockReturnValue({
        ...defaultMockHook,
        neighbors: undefined
      });

      renderCountryDetail();
      
      expect(screen.getByText('No neighbors')).toBeInTheDocument();
      expect(screen.queryByTestId('neighbor-0')).not.toBeInTheDocument();
    });
  });

  describe('Country with Missing Data', () => {
    it('should handle country without capital', () => {
      const countryWithoutCapital = {
        ...mockCountry,
        capital: undefined
      };

      useCountryDetail.mockReturnValue({
        ...defaultMockHook,
        country: countryWithoutCapital
      });

      renderCountryDetail();
      
      expect(screen.getByText('Capital: N/A')).toBeInTheDocument();
    });

    it('should handle country with empty capital array', () => {
      const countryWithEmptyCapital = {
        ...mockCountry,
        capital: []
      };

      useCountryDetail.mockReturnValue({
        ...defaultMockHook,
        country: countryWithEmptyCapital
      });

      renderCountryDetail();
      
      expect(screen.getByText('Capital: N/A')).toBeInTheDocument();
    });

    it('should handle country without flags', () => {
      const countryWithoutFlags = {
        ...mockCountry,
        flags: undefined
      };

      useCountryDetail.mockReturnValue({
        ...defaultMockHook,
        country: countryWithoutFlags
      });

      renderCountryDetail();
      
      const flagImage = screen.getByAltText('United States flag');
      expect(flagImage).not.toHaveAttribute('src');
    });
  });

  describe('Hook Integration', () => {
    it('should call useCountryDetail with correct country code', () => {
      renderCountryDetail();
      
      expect(useCountryDetail).toHaveBeenCalledWith('USA');
    });

    it('should pass country data to CountryHeader', () => {
      renderCountryDetail();
      
      // The CountryHeader mock will receive the country from useCountryDetail
      // We can verify this by checking that it renders the expected country name
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    it('should pass country data to CountryInfo', () => {
      renderCountryDetail();
      
      // The CountryInfo mock will receive the country from useCountryDetail
      // We can verify this by checking that it renders the expected country data
      expect(screen.getByText('Population: 331002651')).toBeInTheDocument();
    });

    it('should pass neighbors data to NeighborList', () => {
      renderCountryDetail();
      
      // The NeighborList mock will receive the neighbors from useCountryDetail
      // We can verify this by checking that it renders the expected neighbor names
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to neighbor country when neighbor is clicked', () => {
      renderCountryDetail();
      
      const firstNeighbor = screen.getByTestId('neighbor-0');
      fireEvent.click(firstNeighbor);
      
      expect(mockNavigate).toHaveBeenCalledWith('/country/CAN');
    });

    it('should navigate to home when back button is clicked', () => {
      renderCountryDetail();
      
      const backButton = screen.getByTestId('back-button');
      fireEvent.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should have correct CSS classes for layout', () => {
      renderCountryDetail();
      
      expect(screen.getByTestId('country-header').closest('section')).toHaveClass('country-detail');
      expect(screen.getByTestId('country-header').closest('.country-detail-content')).toHaveClass('country-detail-content');
    });
  });

  describe('URL Parameters', () => {
    it('should use country code from URL parameters', () => {
      renderCountryDetail();
      
      expect(useCountryDetail).toHaveBeenCalledWith('USA');
    });
  });
});
