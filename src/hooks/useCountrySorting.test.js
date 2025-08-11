import { renderHook, act } from '@testing-library/react';
import { useCountrySorting } from './useCountrySorting';

describe('useCountrySorting', () => {
  const mockCountries = [
    {
      name: { common: 'Canada' },
      population: 38000000,
      area: 9985000
    },
    {
      name: { common: 'United States' },
      population: 331000000,
      area: 9834000
    },
    {
      name: { common: 'Mexico' },
      population: 128900000,
      area: 1964000
    },
    {
      name: { common: 'Brazil' },
      population: 212600000,
      area: 8516000
    },
    {
      name: { common: 'Argentina' },
      population: 45190000,
      area: 2780000
    }
  ];

  test('should have initial state', () => {
    const { result } = renderHook(() => useCountrySorting(mockCountries));

    expect(result.current.sortBy).toBe('population');
    // Initial state should be sorted by population (descending)
    expect(result.current.sortedCountries).toEqual([
      mockCountries[1], // United States (331M)
      mockCountries[3], // Brazil (212M)
      mockCountries[2], // Mexico (128M)
      mockCountries[4], // Argentina (45M)
      mockCountries[0]  // Canada (38M)
    ]);
  });

  test('should sort by population (descending) by default', () => {
    const { result } = renderHook(() => useCountrySorting(mockCountries));

    expect(result.current.sortedCountries).toEqual([
      mockCountries[1], // United States (331M)
      mockCountries[3], // Brazil (212M)
      mockCountries[2], // Mexico (128M)
      mockCountries[4], // Argentina (45M)
      mockCountries[0]  // Canada (38M)
    ]);
  });

  test('should sort by name (alphabetical)', () => {
    const { result } = renderHook(() => useCountrySorting(mockCountries));

    act(() => {
      result.current.setSortBy('name');
    });

    expect(result.current.sortBy).toBe('name');
    expect(result.current.sortedCountries).toEqual([
      mockCountries[4], // Argentina
      mockCountries[3], // Brazil
      mockCountries[0], // Canada
      mockCountries[2], // Mexico
      mockCountries[1]  // United States
    ]);
  });

  test('should sort by area (descending)', () => {
    const { result } = renderHook(() => useCountrySorting(mockCountries));

    act(() => {
      result.current.setSortBy('area');
    });

    expect(result.current.sortBy).toBe('area');
    expect(result.current.sortedCountries).toEqual([
      mockCountries[0], // Canada (9,985,000)
      mockCountries[1], // United States (9,834,000)
      mockCountries[3], // Brazil (8,516,000)
      mockCountries[4], // Argentina (2,780,000)
      mockCountries[2]  // Mexico (1,964,000)
    ]);
  });

  test('should handle countries with undefined area', () => {
    const countriesWithUndefinedArea = [
      {
        name: { common: 'Country A' },
        population: 1000000,
        area: undefined
      },
      {
        name: { common: 'Country B' },
        population: 2000000,
        area: 5000
      },
      {
        name: { common: 'Country C' },
        population: 3000000,
        area: 10000
      }
    ];

    const { result } = renderHook(() => useCountrySorting(countriesWithUndefinedArea));

    act(() => {
      result.current.setSortBy('area');
    });

    expect(result.current.sortedCountries).toEqual([
      countriesWithUndefinedArea[2], // Country C (10,000)
      countriesWithUndefinedArea[1], // Country B (5,000)
      countriesWithUndefinedArea[0]  // Country A (undefined -> 0)
    ]);
  });

  test('should handle countries with null area', () => {
    const countriesWithNullArea = [
      {
        name: { common: 'Country A' },
        population: 1000000,
        area: null
      },
      {
        name: { common: 'Country B' },
        population: 2000000,
        area: 5000
      }
    ];

    const { result } = renderHook(() => useCountrySorting(countriesWithNullArea));

    act(() => {
      result.current.setSortBy('area');
    });

    expect(result.current.sortedCountries).toEqual([
      countriesWithNullArea[1], // Country B (5,000)
      countriesWithNullArea[0]  // Country A (null -> 0)
    ]);
  });

  test('should handle countries with zero area', () => {
    const countriesWithZeroArea = [
      {
        name: { common: 'Country A' },
        population: 1000000,
        area: 0
      },
      {
        name: { common: 'Country B' },
        population: 2000000,
        area: 5000
      }
    ];

    const { result } = renderHook(() => useCountrySorting(countriesWithZeroArea));

    act(() => {
      result.current.setSortBy('area');
    });

    expect(result.current.sortedCountries).toEqual([
      countriesWithZeroArea[1], // Country B (5,000)
      countriesWithZeroArea[0]  // Country A (0)
    ]);
  });

  test('should handle unknown sort field (fallback to population)', () => {
    const { result } = renderHook(() => useCountrySorting(mockCountries));

    act(() => {
      result.current.setSortBy('unknown');
    });

    expect(result.current.sortBy).toBe('unknown');
    expect(result.current.sortedCountries).toEqual([
      mockCountries[1], // United States (331M)
      mockCountries[3], // Brazil (212M)
      mockCountries[2], // Mexico (128M)
      mockCountries[4], // Argentina (45M)
      mockCountries[0]  // Canada (38M)
    ]);
  });

  test('should handle empty countries array', () => {
    const { result } = renderHook(() => useCountrySorting([]));

    expect(result.current.sortedCountries).toEqual([]);

    act(() => {
      result.current.setSortBy('name');
    });

    expect(result.current.sortedCountries).toEqual([]);
  });

  test('should handle null/undefined countries', () => {
    const { result } = renderHook(() => useCountrySorting(null));

    expect(result.current.sortedCountries).toEqual([]);

    const { result: result2 } = renderHook(() => useCountrySorting(undefined));

    expect(result2.current.sortedCountries).toEqual([]);
  });

  test('should handle single country', () => {
    const singleCountry = [mockCountries[0]];

    const { result } = renderHook(() => useCountrySorting(singleCountry));

    expect(result.current.sortedCountries).toEqual(singleCountry);

    act(() => {
      result.current.setSortBy('name');
    });

    expect(result.current.sortedCountries).toEqual(singleCountry);
  });

  test('should handle countries with same values', () => {
    const countriesWithSameValues = [
      {
        name: { common: 'Country A' },
        population: 1000000,
        area: 5000
      },
      {
        name: { common: 'Country B' },
        population: 1000000,
        area: 5000
      }
    ];

    const { result } = renderHook(() => useCountrySorting(countriesWithSameValues));

    // Population sorting should maintain order for same values
    expect(result.current.sortedCountries).toEqual(countriesWithSameValues);

    act(() => {
      result.current.setSortBy('area');
    });

    // Area sorting should maintain order for same values
    expect(result.current.sortedCountries).toEqual(countriesWithSameValues);
  });

  test('should handle countries with missing properties', () => {
    const countriesWithMissingProps = [
      {
        name: { common: 'Country A' },
        population: 1000000
        // Missing area
      },
      {
        name: { common: 'Country B' },
        population: 2000000,
        area: 5000
      }
    ];

    const { result } = renderHook(() => useCountrySorting(countriesWithMissingProps));

    act(() => {
      result.current.setSortBy('area');
    });

    expect(result.current.sortedCountries).toEqual([
      countriesWithMissingProps[1], // Country B (5,000)
      countriesWithMissingProps[0]  // Country A (missing -> 0)
    ]);
  });

  test('should update sorting when filteredCountries change', () => {
    const { result, rerender } = renderHook(
      ({ countries }) => useCountrySorting(countries),
      { initialProps: { countries: mockCountries } }
    );

    // Initial sort by population
    expect(result.current.sortedCountries[0].name.common).toBe('United States');

    // Change to name sorting
    act(() => {
      result.current.setSortBy('name');
    });

    expect(result.current.sortedCountries[0].name.common).toBe('Argentina');

    // Rerender with new countries
    const newCountries = [
      {
        name: { common: 'Zimbabwe' },
        population: 15000000,
        area: 390000
      },
      {
        name: { common: 'Australia' },
        population: 25000000,
        area: 7692000
      }
    ];

    rerender({ countries: newCountries });

    // Should maintain name sorting with new countries
    expect(result.current.sortedCountries[0].name.common).toBe('Australia');
    expect(result.current.sortedCountries[1].name.common).toBe('Zimbabwe');
  });

  describe('Edge Cases', () => {
    it('should handle unknown sort field by defaulting to population sorting', () => {
      const { result } = renderHook(() => useCountrySorting(mockCountries));
      
      // Set an unknown sort field
      act(() => {
        result.current.setSortBy('unknown_field');
      });
      
      // Should default to population sorting (highest to lowest)
      // Based on mock data: USA(331M) > Brazil(212M) > Mexico(128M) > Argentina(45M) > Canada(38M)
      expect(result.current.sortedCountries).toEqual([
        mockCountries[1], // United States - highest population (331,000,000)
        mockCountries[3], // Brazil - second highest (212,600,000)
        mockCountries[2], // Mexico - third highest (128,900,000)
        mockCountries[4], // Argentina - fourth highest (45,190,000)
        mockCountries[0]  // Canada - lowest population (38,000,000)
      ]);
    });
  });
});
