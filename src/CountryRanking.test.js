import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CountryRanking from './CountryRanking';
import { useCountries, useCountryFilters, useCountrySorting, useCountryPagination } from './hooks';

// Mock the custom hooks
jest.mock('./hooks', () => ({
  useCountries: jest.fn(),
  useCountryFilters: jest.fn(),
  useCountrySorting: jest.fn(),
  useCountryPagination: jest.fn()
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock components
jest.mock('./components/country', () => ({
  SearchBar: ({ search, onSearchChange, className }) => (
    <input
      data-testid={`search-${className}`}
      type="text"
      value={search}
      onChange={(e) => onSearchChange(e)}
      placeholder="Search by Name, Region, Subregion"
    />
  ),
  FilterSidebar: ({ sortBy, onSortChange, selectedRegions, onRegionToggle, filterUN, onFilterUNChange, filterIndependent, onFilterIndependentChange }) => (
    <div data-testid="filter-sidebar">
      <select value={sortBy} onChange={(e) => onSortChange(e)} data-testid="sort-select">
        <option value="population">Population</option>
        <option value="name">Name</option>
        <option value="area">Area</option>
      </select>
      <input
        type="checkbox"
        checked={filterUN}
        onChange={(e) => onFilterUNChange(e)}
        data-testid="un-filter"
      />
      <input
        type="checkbox"
        checked={filterIndependent}
        onChange={(e) => onFilterIndependentChange(e)}
        data-testid="independent-filter"
      />
    </div>
  ),
  CountryTable: ({ countries, onRowClick }) => (
    <table data-testid="country-table">
      <tbody>
        {countries.map((country, index) => (
          <tr key={country.cca3} data-testid={`country-row-${index}`} onClick={() => onRowClick(country.cca3)}>
            <td>{country.name.common}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
  PaginationControls: ({ page, totalPages, viewAll, onPrev, onNext, onViewAll, onPaginate }) => (
    <div data-testid="pagination-controls">
      <button onClick={onPrev} data-testid="prev-button">Previous</button>
      <span data-testid="page-info">{page} / {totalPages}</span>
      <button onClick={onNext} data-testid="next-button">Next</button>
      <button onClick={onViewAll} data-testid="view-all-button">View All</button>
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

const mockCountries = [
  { cca3: 'USA', name: { common: 'United States' }, population: 331002651, area: 9833517, region: 'Americas' },
  { cca3: 'CAN', name: { common: 'Canada' }, population: 37742154, area: 9984670, region: 'Americas' },
  { cca3: 'MEX', name: { common: 'Mexico' }, population: 128932753, area: 1964375, region: 'Americas' }
];

const defaultMockHooks = {
  useCountries: {
    countries: mockCountries,
    loading: false,
    error: null,
    refetch: jest.fn()
  },
  useCountryFilters: {
    filteredCountries: mockCountries,
    selectedRegions: [],
    filterUN: false,
    filterIndependent: false,
    search: '',
    setSearch: jest.fn(),
    toggleRegion: jest.fn(),
    setFilterUN: jest.fn(),
    setFilterIndependent: jest.fn()
  },
  useCountrySorting: {
    sortedCountries: mockCountries,
    sortBy: 'population',
    setSortBy: jest.fn()
  },
  useCountryPagination: {
    paginatedCountries: mockCountries,
    page: 1,
    totalPages: 1,
    viewAll: false,
    handlePrev: jest.fn(),
    handleNext: jest.fn(),
    handleViewAll: jest.fn(),
    handlePaginate: jest.fn()
  }
};

const renderCountryRanking = () => {
  return render(
    <BrowserRouter>
      <CountryRanking />
    </BrowserRouter>
  );
};

describe('CountryRanking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    
    // Set up default mock implementations
    useCountries.mockReturnValue(defaultMockHooks.useCountries);
    useCountryFilters.mockReturnValue(defaultMockHooks.useCountryFilters);
    useCountrySorting.mockReturnValue(defaultMockHooks.useCountrySorting);
    useCountryPagination.mockReturnValue(defaultMockHooks.useCountryPagination);
  });

  describe('Rendering', () => {
    it('should render the main structure', () => {
      renderCountryRanking();
      
      expect(screen.getByText('World Ranks')).toBeInTheDocument();
      expect(screen.getAllByText('Found 3 countries')).toHaveLength(2); // desktop and mobile
      expect(screen.getByTestId('country-table')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-controls')).toBeInTheDocument();
    });

    it('should render both desktop and mobile search bars', () => {
      renderCountryRanking();
      
      expect(screen.getByTestId('search-desktop-only')).toBeInTheDocument();
      expect(screen.getByTestId('search-mobile-only')).toBeInTheDocument();
    });

    it('should render filter sidebar with controls', () => {
      renderCountryRanking();
      
      expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('sort-select')).toBeInTheDocument();
      expect(screen.getByTestId('un-filter')).toBeInTheDocument();
      expect(screen.getByTestId('independent-filter')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      useCountries.mockReturnValue({
        ...defaultMockHooks.useCountries,
        loading: true
      });

      renderCountryRanking();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading countries...')).toBeInTheDocument();
      expect(screen.queryByTestId('country-table')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error display when there is an error', () => {
      useCountries.mockReturnValue({
        ...defaultMockHooks.useCountries,
        error: 'Failed to fetch countries'
      });

      renderCountryRanking();
      
      expect(screen.getByTestId('error-display')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch countries')).toBeInTheDocument();
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
      expect(screen.queryByTestId('country-table')).not.toBeInTheDocument();
    });

    it('should call refetch when retry button is clicked', () => {
      const mockRefetch = jest.fn();
      useCountries.mockReturnValue({
        ...defaultMockHooks.useCountries,
        error: 'Failed to fetch countries',
        refetch: mockRefetch
      });

      renderCountryRanking();
      
      fireEvent.click(screen.getByTestId('retry-button'));
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Country Count Display', () => {
    it('should display correct count of countries', () => {
      renderCountryRanking();
      
      expect(screen.getAllByText('Found 3 countries')).toHaveLength(2); // desktop and mobile
    });

    it('should update count when filtered countries change', () => {
      // Mock with different sorted countries count (since component uses sortedCountries.length)
      useCountrySorting.mockReturnValue({
        ...defaultMockHooks.useCountrySorting,
        sortedCountries: [mockCountries[0], mockCountries[1]] // Only 2 countries
      });

      renderCountryRanking();
      
      expect(screen.getAllByText('Found 2 countries')).toHaveLength(2);
    });
  });

  describe('Search Functionality', () => {
    it('should call setSearch when desktop search input changes', () => {
      const mockSetSearch = jest.fn();
      useCountryFilters.mockReturnValue({
        ...defaultMockHooks.useCountryFilters,
        setSearch: mockSetSearch
      });

      renderCountryRanking();
      
      const desktopSearch = screen.getByTestId('search-desktop-only');
      fireEvent.change(desktopSearch, { target: { value: 'test' } });
      
      expect(mockSetSearch).toHaveBeenCalledWith('test');
    });

    it('should call setSearch when mobile search input changes', () => {
      const mockSetSearch = jest.fn();
      useCountryFilters.mockReturnValue({
        ...defaultMockHooks.useCountryFilters,
        setSearch: mockSetSearch
      });

      renderCountryRanking();
      
      const mobileSearch = screen.getByTestId('search-mobile-only');
      fireEvent.change(mobileSearch, { target: { value: 'test' } });
      
      expect(mockSetSearch).toHaveBeenCalledWith('test');
    });
  });

  describe('Filter Interactions', () => {
    it('should call setSortBy when sort select changes', () => {
      const mockSetSortBy = jest.fn();
      useCountrySorting.mockReturnValue({
        ...defaultMockHooks.useCountrySorting,
        setSortBy: mockSetSortBy
      });

      renderCountryRanking();
      
      const sortSelect = screen.getByTestId('sort-select');
      fireEvent.change(sortSelect, { target: { value: 'name' } });
      
      expect(mockSetSortBy).toHaveBeenCalledWith('name');
    });

    it('should call setFilterUN when UN filter checkbox changes', () => {
      const mockSetFilterUN = jest.fn();
      useCountryFilters.mockReturnValue({
        ...defaultMockHooks.useCountryFilters,
        setFilterUN: mockSetFilterUN
      });

      renderCountryRanking();
      
      const unFilter = screen.getByTestId('un-filter');
      fireEvent.click(unFilter);
      
      expect(mockSetFilterUN).toHaveBeenCalledWith(true);
    });

    it('should call setFilterIndependent when independent filter checkbox changes', () => {
      const mockSetFilterIndependent = jest.fn();
      useCountryFilters.mockReturnValue({
        ...defaultMockHooks.useCountryFilters,
        setFilterIndependent: mockSetFilterIndependent
      });

      renderCountryRanking();
      
      const independentFilter = screen.getByTestId('independent-filter');
      fireEvent.click(independentFilter);
      
      expect(mockSetFilterIndependent).toHaveBeenCalledWith(true);
    });
  });

  describe('Country Table Interactions', () => {
    it('should render country rows with correct data', () => {
      renderCountryRanking();
      
      expect(screen.getByTestId('country-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('country-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('country-row-2')).toBeInTheDocument();
    });

    it('should call navigate when country row is clicked', () => {
      renderCountryRanking();
      
      const firstRow = screen.getByTestId('country-row-0');
      fireEvent.click(firstRow);
      
      expect(mockNavigate).toHaveBeenCalledWith('/country/USA');
    });
  });

  describe('Pagination Interactions', () => {
    it('should call handlePrev when previous button is clicked', () => {
      const mockHandlePrev = jest.fn();
      useCountryPagination.mockReturnValue({
        ...defaultMockHooks.useCountryPagination,
        handlePrev: mockHandlePrev
      });

      renderCountryRanking();
      
      const prevButton = screen.getByTestId('prev-button');
      fireEvent.click(prevButton);
      
      expect(mockHandlePrev).toHaveBeenCalledTimes(1);
    });

    it('should call handleNext when next button is clicked', () => {
      const mockHandleNext = jest.fn();
      useCountryPagination.mockReturnValue({
        ...defaultMockHooks.useCountryPagination,
        handleNext: mockHandleNext
      });

      renderCountryRanking();
      
      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);
      
      expect(mockHandleNext).toHaveBeenCalledTimes(1);
    });

    it('should call handleViewAll when view all button is clicked', () => {
      const mockHandleViewAll = jest.fn();
      useCountryPagination.mockReturnValue({
        ...defaultMockHooks.useCountryPagination,
        handleViewAll: mockHandleViewAll
      });

      renderCountryRanking();
      
      const viewAllButton = screen.getByTestId('view-all-button');
      fireEvent.click(viewAllButton);
      
      expect(mockHandleViewAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hook Integration', () => {
    it('should pass countries to useCountryFilters', () => {
      renderCountryRanking();
      
      expect(useCountryFilters).toHaveBeenCalledWith(mockCountries);
    });

    it('should pass filteredCountries to useCountrySorting', () => {
      renderCountryRanking();
      
      expect(useCountrySorting).toHaveBeenCalledWith(mockCountries);
    });

    it('should pass sortedCountries to useCountryPagination', () => {
      renderCountryRanking();
      
      expect(useCountryPagination).toHaveBeenCalledWith(mockCountries);
    });

    it('should pass paginatedCountries to CountryTable', () => {
      renderCountryRanking();
      
      // The CountryTable mock will receive the paginatedCountries from useCountryPagination
      // We can verify this by checking that the table renders the expected number of rows
      expect(screen.getAllByTestId(/country-row-/)).toHaveLength(3);
    });
  });

  describe('Navigation', () => {
    it('should navigate to country detail page when row is clicked', () => {
      renderCountryRanking();
      
      const firstRow = screen.getByTestId('country-row-0');
      fireEvent.click(firstRow);
      
      expect(mockNavigate).toHaveBeenCalledWith('/country/USA');
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should have correct CSS classes for layout', () => {
      renderCountryRanking();
      
      expect(screen.getByText('World Ranks').closest('section')).toHaveClass('country-ranking');
      expect(screen.getByText('World Ranks').closest('div')).toHaveClass('mobile-header');
      expect(screen.getByText('World Ranks')).toHaveClass('mobile-title');
    });

    it('should have correct CSS classes for search containers', () => {
      renderCountryRanking();
      
      const desktopSearch = screen.getByTestId('search-desktop-only');
      const mobileSearch = screen.getByTestId('search-mobile-only');
      
      expect(desktopSearch.closest('div')).toHaveClass('desktop-country-count-container');
      expect(mobileSearch.closest('div')).toHaveClass('mobile-header-content');
    });
  });
});
