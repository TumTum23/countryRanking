import { renderHook, act } from '@testing-library/react';
import { useCountryPagination } from './useCountryPagination';

// Mock the PAGE_SIZE constant
jest.mock('../utils/constants', () => ({
  PAGE_SIZE: 3
}));

describe('useCountryPagination', () => {
  const mockCountries = [
    { name: { common: 'Country A' }, population: 1000000 },
    { name: { common: 'Country B' }, population: 2000000 },
    { name: { common: 'Country C' }, population: 3000000 },
    { name: { common: 'Country D' }, population: 4000000 },
    { name: { common: 'Country E' }, population: 5000000 },
    { name: { common: 'Country F' }, population: 6000000 },
    { name: { common: 'Country G' }, population: 7000000 }
  ];

  beforeEach(() => {
    // Clear any mocks
    jest.clearAllMocks();
  });

  test('should have initial state', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    expect(result.current.page).toBe(1);
    expect(result.current.viewAll).toBe(false);
    expect(result.current.totalPages).toBe(3); // 7 countries / 3 per page = 3 pages
    expect(result.current.paginatedCountries).toEqual(mockCountries.slice(0, 3)); // First 3 countries
  });

  test('should paginate countries correctly', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    // Page 1: Countries A, B, C
    expect(result.current.paginatedCountries).toEqual([
      mockCountries[0], // Country A
      mockCountries[1], // Country B
      mockCountries[2]  // Country C
    ]);

    // Go to page 2
    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);
    expect(result.current.paginatedCountries).toEqual([
      mockCountries[3], // Country D
      mockCountries[4], // Country E
      mockCountries[5]  // Country F
    ]);

    // Go to page 3
    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
    expect(result.current.paginatedCountries).toEqual([
      mockCountries[6] // Country G (only 1 country on last page)
    ]);
  });

  test('should handle view all mode', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    // Initially paginated
    expect(result.current.viewAll).toBe(false);
    expect(result.current.paginatedCountries).toHaveLength(3);

    // Switch to view all
    act(() => {
      result.current.handleViewAll();
    });

    expect(result.current.viewAll).toBe(true);
    expect(result.current.paginatedCountries).toEqual(mockCountries);
    expect(result.current.paginatedCountries).toHaveLength(7);
  });

  test('should handle switch back to paginated mode', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    // Switch to view all
    act(() => {
      result.current.handleViewAll();
    });

    expect(result.current.viewAll).toBe(true);

    // Switch back to paginated
    act(() => {
      result.current.handlePaginate();
    });

    expect(result.current.viewAll).toBe(false);
    expect(result.current.paginatedCountries).toHaveLength(3);
    expect(result.current.paginatedCountries).toEqual(mockCountries.slice(0, 3));
  });

  test('should handle navigation with handlePrev', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    // Go to page 2
    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);

    // Go to previous page
    act(() => {
      result.current.handlePrev();
    });

    expect(result.current.page).toBe(1);
  });

  test('should not go below page 1 with handlePrev', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    expect(result.current.page).toBe(1);

    // Try to go to previous page
    act(() => {
      result.current.handlePrev();
    });

    expect(result.current.page).toBe(1); // Should stay at page 1
  });

  test('should handle navigation with handleNext', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    expect(result.current.page).toBe(1);

    // Go to next page
    act(() => {
      result.current.handleNext();
    });

    expect(result.current.page).toBe(2);
  });

  test('should not go above total pages with handleNext', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    // Go to last page
    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);

    // Try to go to next page
    act(() => {
      result.current.handleNext();
    });

    expect(result.current.page).toBe(3); // Should stay at page 3
  });

  test('should handle goToPage with valid page numbers', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    // Go to page 2
    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.page).toBe(2);

    // Go to page 3
    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.page).toBe(3);
  });

  test('should not go to invalid page numbers', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    // Try to go to page 0
    act(() => {
      result.current.goToPage(0);
    });

    expect(result.current.page).toBe(1); // Should stay at page 1

    // Try to go to page 4 (beyond total pages)
    act(() => {
      result.current.goToPage(4);
    });

    expect(result.current.page).toBe(1); // Should stay at page 1
  });

  test('should reset to page 1 when sortedCountries change', () => {
    const { result, rerender } = renderHook(
      ({ countries }) => useCountryPagination(countries),
      { initialProps: { countries: mockCountries } }
    );

    // Go to page 2
    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);

    // Change the countries array
    const newCountries = [
      { name: { common: 'New Country A' }, population: 1000000 },
      { name: { common: 'New Country B' }, population: 2000000 }
    ];

    rerender({ countries: newCountries });

    // Should reset to page 1
    expect(result.current.page).toBe(1);
    expect(result.current.viewAll).toBe(false);
  });

  test('should handle empty countries array', () => {
    const { result } = renderHook(() => useCountryPagination([]));

    expect(result.current.page).toBe(1);
    expect(result.current.viewAll).toBe(false);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.paginatedCountries).toEqual([]);
  });

  test('should handle null/undefined countries', () => {
    const { result } = renderHook(() => useCountryPagination(null));

    expect(result.current.page).toBe(1);
    expect(result.current.viewAll).toBe(false);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.paginatedCountries).toEqual([]);

    const { result: result2 } = renderHook(() => useCountryPagination(undefined));

    expect(result2.current.page).toBe(1);
    expect(result2.current.viewAll).toBe(false);
    expect(result2.current.totalPages).toBe(0);
    expect(result2.current.paginatedCountries).toEqual([]);
  });

  test('should handle countries array smaller than page size', () => {
    const smallCountries = [
      { name: { common: 'Country A' }, population: 1000000 },
      { name: { common: 'Country B' }, population: 2000000 }
    ];

    const { result } = renderHook(() => useCountryPagination(smallCountries));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedCountries).toEqual(smallCountries);
  });

  test('should handle countries array exactly page size', () => {
    const exactCountries = [
      { name: { common: 'Country A' }, population: 1000000 },
      { name: { common: 'Country B' }, population: 2000000 },
      { name: { common: 'Country C' }, population: 3000000 }
    ];

    const { result } = renderHook(() => useCountryPagination(exactCountries));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedCountries).toEqual(exactCountries);
  });

  test('should handle last page with fewer items than page size', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    // Go to last page
    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
    expect(result.current.paginatedCountries).toHaveLength(1);
    expect(result.current.paginatedCountries).toEqual([mockCountries[6]]);
  });

  test('should maintain viewAll state when switching pages', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    // Switch to view all
    act(() => {
      result.current.handleViewAll();
    });

    expect(result.current.viewAll).toBe(true);

    // Try to change page (should not affect viewAll)
    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.viewAll).toBe(true);
    expect(result.current.paginatedCountries).toEqual(mockCountries); // Still showing all
  });

  test('should calculate total pages correctly for various array sizes', () => {
    // Test with 0 countries
    const { result: result0 } = renderHook(() => useCountryPagination([]));
    expect(result0.current.totalPages).toBe(0);

    // Test with 1 country
    const { result: result1 } = renderHook(() => useCountryPagination([mockCountries[0]]));
    expect(result1.current.totalPages).toBe(1);

    // Test with 3 countries (exactly one page)
    const { result: result3 } = renderHook(() => useCountryPagination(mockCountries.slice(0, 3)));
    expect(result3.current.totalPages).toBe(1);

    // Test with 4 countries (2 pages)
    const { result: result4 } = renderHook(() => useCountryPagination(mockCountries.slice(0, 4)));
    expect(result4.current.totalPages).toBe(2);

    // Test with 7 countries (3 pages)
    const { result: result7 } = renderHook(() => useCountryPagination(mockCountries));
    expect(result7.current.totalPages).toBe(3);
  });

  test('should handle edge case of very large page numbers', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    // Try to set a very large page number
    act(() => {
      result.current.setPage(999);
    });

    expect(result.current.page).toBe(1); // Should stay at page 1
    expect(result.current.paginatedCountries).toEqual(mockCountries.slice(0, 3));
  });

  test('should handle negative page numbers', () => {
    const { result } = renderHook(() => useCountryPagination(mockCountries));

    // Try to set a negative page number
    act(() => {
      result.current.setPage(-1);
    });

    expect(result.current.page).toBe(1); // Should stay at page 1
    expect(result.current.paginatedCountries).toEqual(mockCountries.slice(0, 3));
  });
});
