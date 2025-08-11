import { renderHook, waitFor, act } from '@testing-library/react';
import { useCountries } from './useCountries';

// Mock fetch globally
global.fetch = jest.fn();

describe('useCountries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    fetch.mockClear();
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useCountries());
    
    expect(result.current.countries).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.refetch).toBe('function');
  });

  test('should fetch countries successfully', async () => {
    const mockCountries = [
      { name: 'Test Country 1', population: 1000000 },
      { name: 'Test Country 2', population: 2000000 }
    ];
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCountries
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.error).toBe(null);
    expect(fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/all?fields=name,population,region,subregion,cca3,flags,area,unMember,independent');
  });

  test('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch countries';
    fetch.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  test('should handle non-ok response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch countries');
  });

  test('should refetch countries when refetch is called', async () => {
    const mockCountries = [{ name: 'Test Country', population: 1000000 }];
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCountries
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Mock second fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [...mockCountries, { name: 'Another Country', population: 2000000 }]
    });

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    // Should be loading after refetch
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test('should set loading to true when fetching', async () => {
    // Mock a delayed response
    fetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => []
        }), 100)
      )
    );

    const { result } = renderHook(() => useCountries());

    // Should be loading initially
    expect(result.current.loading).toBe(true);
  });

  test('should clear error when refetching', async () => {
    // First fetch fails
    fetch.mockRejectedValueOnce(new Error('First error'));
    
    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('First error');

    // Second fetch succeeds
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    act(() => {
      result.current.refetch();
    });

    // Error should be cleared when refetching
    expect(result.current.error).toBe(null);
  });
});
