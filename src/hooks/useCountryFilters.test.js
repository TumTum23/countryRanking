import { renderHook, act } from '@testing-library/react';
import { useCountryFilters } from './useCountryFilters';

describe('useCountryFilters', () => {
  const mockCountries = [
    {
      name: { common: 'United States' },
      region: 'Americas',
      subregion: 'North America',
      unMember: true,
      independent: true
    },
    {
      name: { common: 'Canada' },
      region: 'Americas',
      subregion: 'North America',
      unMember: true,
      independent: true
    },
    {
      name: { common: 'Mexico' },
      region: 'Americas',
      subregion: 'North America',
      unMember: true,
      independent: true
    },
    {
      name: { common: 'United Kingdom' },
      region: 'Europe',
      subregion: 'Northern Europe',
      unMember: true,
      independent: true
    },
    {
      name: { common: 'France' },
      region: 'Europe',
      subregion: 'Western Europe',
      unMember: true,
      independent: true
    },
    {
      name: { common: 'China' },
      region: 'Asia',
      subregion: 'Eastern Asia',
      unMember: true,
      independent: true
    },
    {
      name: { common: 'Taiwan' },
      region: 'Asia',
      subregion: 'Eastern Asia',
      unMember: false,
      independent: false
    }
  ];

  test('should have initial state', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    expect(result.current.selectedRegions).toEqual([]);
    expect(result.current.filterUN).toBe(false);
    expect(result.current.filterIndependent).toBe(false);
    expect(result.current.search).toBe('');
    expect(result.current.filteredCountries).toEqual(mockCountries);
  });

  test('should filter by selected regions', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setSelectedRegions(['Americas']);
    });

    expect(result.current.selectedRegions).toEqual(['Americas']);
    expect(result.current.filteredCountries).toHaveLength(3);
    expect(result.current.filteredCountries).toEqual(
      mockCountries.filter(c => c.region === 'Americas')
    );
  });

  test('should filter by multiple regions', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setSelectedRegions(['Americas', 'Europe']);
    });

    expect(result.current.selectedRegions).toEqual(['Americas', 'Europe']);
    expect(result.current.filteredCountries).toHaveLength(5);
    expect(result.current.filteredCountries).toEqual(
      mockCountries.filter(c => ['Americas', 'Europe'].includes(c.region))
    );
  });

  test('should filter by UN membership', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setFilterUN(true);
    });

    expect(result.current.filterUN).toBe(true);
    expect(result.current.filteredCountries).toHaveLength(6);
    expect(result.current.filteredCountries).toEqual(
      mockCountries.filter(c => c.unMember)
    );
  });

  test('should filter by independence', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setFilterIndependent(true);
    });

    expect(result.current.filterIndependent).toBe(true);
    expect(result.current.filteredCountries).toHaveLength(6);
    expect(result.current.filteredCountries).toEqual(
      mockCountries.filter(c => c.independent)
    );
  });

  test('should filter by search term (country name)', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setSearch('United');
    });

    expect(result.current.search).toBe('United');
    expect(result.current.filteredCountries).toHaveLength(2);
    expect(result.current.filteredCountries).toEqual([
      mockCountries[0], // United States
      mockCountries[3]  // United Kingdom
    ]);
  });

  test('should filter by search term (region)', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setSearch('Europe');
    });

    expect(result.current.search).toBe('Europe');
    expect(result.current.filteredCountries).toHaveLength(2);
    expect(result.current.filteredCountries).toEqual([
      mockCountries[3], // United Kingdom
      mockCountries[4]  // France
    ]);
  });

  test('should filter by search term (subregion)', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setSearch('North America');
    });

    expect(result.current.search).toBe('North America');
    expect(result.current.filteredCountries).toHaveLength(3);
    expect(result.current.filteredCountries).toEqual([
      mockCountries[0], // United States
      mockCountries[1], // Canada
      mockCountries[2]  // Mexico
    ]);
  });

  test('should filter by search term (case insensitive)', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setSearch('united');
    });

    expect(result.current.search).toBe('united');
    expect(result.current.filteredCountries).toHaveLength(2);
    expect(result.current.filteredCountries).toEqual([
      mockCountries[0], // United States
      mockCountries[3]  // United Kingdom
    ]);
  });

  test('should filter by search term (trimmed)', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setSearch('  United  ');
    });

    expect(result.current.search).toBe('  United  ');
    expect(result.current.filteredCountries).toHaveLength(2);
    expect(result.current.filteredCountries).toEqual([
      mockCountries[0], // United States
      mockCountries[3]  // United Kingdom
    ]);
  });

  test('should combine multiple filters', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setSelectedRegions(['Americas']);
      result.current.setFilterUN(true);
      result.current.setSearch('United');
    });

    expect(result.current.selectedRegions).toEqual(['Americas']);
    expect(result.current.filterUN).toBe(true);
    expect(result.current.search).toBe('United');
    expect(result.current.filteredCountries).toHaveLength(1);
    expect(result.current.filteredCountries).toEqual([mockCountries[0]]); // United States
  });

  test('should handle empty search term', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setSearch('');
    });

    expect(result.current.search).toBe('');
    expect(result.current.filteredCountries).toEqual(mockCountries);
  });

  test('should handle search term with no matches', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    act(() => {
      result.current.setSearch('NonExistentCountry');
    });

    expect(result.current.search).toBe('NonExistentCountry');
    expect(result.current.filteredCountries).toHaveLength(0);
  });

  test('should toggle region selection', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    // Add region
    act(() => {
      result.current.toggleRegion('Americas');
    });

    expect(result.current.selectedRegions).toEqual(['Americas']);

    // Remove region
    act(() => {
      result.current.toggleRegion('Americas');
    });

    expect(result.current.selectedRegions).toEqual([]);

    // Add multiple regions
    act(() => {
      result.current.toggleRegion('Americas');
      result.current.toggleRegion('Europe');
    });

    expect(result.current.selectedRegions).toEqual(['Americas', 'Europe']);
  });

  test('should reset all filters', () => {
    const { result } = renderHook(() => useCountryFilters(mockCountries));

    // Set some filters
    act(() => {
      result.current.setSelectedRegions(['Americas', 'Europe']);
      result.current.setFilterUN(true);
      result.current.setFilterIndependent(true);
      result.current.setSearch('United');
    });

    // Verify filters are set
    expect(result.current.selectedRegions).toEqual(['Americas', 'Europe']);
    expect(result.current.filterUN).toBe(true);
    expect(result.current.filterIndependent).toBe(true);
    expect(result.current.search).toBe('United');

    // Reset filters
    act(() => {
      result.current.resetFilters();
    });

    // Verify filters are reset
    expect(result.current.selectedRegions).toEqual([]);
    expect(result.current.filterUN).toBe(false);
    expect(result.current.filterIndependent).toBe(false);
    expect(result.current.search).toBe('');
    expect(result.current.filteredCountries).toEqual(mockCountries);
  });

  test('should handle countries with missing properties', () => {
    const countriesWithMissingProps = [
      {
        name: { common: 'Country A' },
        region: 'Americas',
        unMember: true,
        independent: true
      },
      {
        name: { common: 'Country B' },
        region: 'Europe',
        // Missing subregion
        unMember: false,
        independent: false
      },
      {
        name: { common: 'Country C' },
        // Missing region
        subregion: 'Some Subregion',
        unMember: true,
        independent: true
      }
    ];

    const { result } = renderHook(() => useCountryFilters(countriesWithMissingProps));

    // Test search with missing subregion
    act(() => {
      result.current.setSearch('Some Subregion');
    });

    expect(result.current.filteredCountries).toHaveLength(1);
    expect(result.current.filteredCountries[0].name.common).toBe('Country C');

    // Test search with missing region
    act(() => {
      result.current.setSearch('Europe');
    });

    expect(result.current.filteredCountries).toHaveLength(1);
    expect(result.current.filteredCountries[0].name.common).toBe('Country B');
  });

  test('should handle empty countries array', () => {
    const { result } = renderHook(() => useCountryFilters([]));

    expect(result.current.filteredCountries).toEqual([]);

    act(() => {
      result.current.setSearch('test');
      result.current.setSelectedRegions(['Americas']);
      result.current.setFilterUN(true);
    });

    expect(result.current.filteredCountries).toEqual([]);
  });

  test('should handle null/undefined countries', () => {
    const { result } = renderHook(() => useCountryFilters(null));

    expect(result.current.filteredCountries).toEqual([]);

    const { result: result2 } = renderHook(() => useCountryFilters(undefined));

    expect(result2.current.filteredCountries).toEqual([]);
  });
});
