import { renderHook, waitFor, act } from '@testing-library/react';
import { useCountryDetail } from './useCountryDetail';

global.fetch = jest.fn();

describe('useCountryDetail', () => {
  const mockCountry = {
    name: { common: 'United States' },
    borders: ['CAN', 'MEX']
  };

  const mockNeighbors = [
    { name: { common: 'Canada' }, cca3: 'CAN' },
    { name: { common: 'Mexico' }, cca3: 'MEX' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should have initial state', () => {
    const { result } = renderHook(() => useCountryDetail('US'));

    expect(result.current.country).toBe(null);
    expect(result.current.neighbors).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  test('should fetch country data when countryCode is provided', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCountry]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockNeighbors
      });

    const { result } = renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.country).toEqual(mockCountry);
    expect(result.current.neighbors).toEqual(mockNeighbors);
    expect(result.current.error).toBe(null);
  });

  test('should handle country without borders', async () => {
    const countryWithoutBorders = { ...mockCountry, borders: [] };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [countryWithoutBorders]
    });

    const { result } = renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.country).toEqual(countryWithoutBorders);
    expect(result.current.neighbors).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  test('should handle country with null borders', async () => {
    const countryWithNullBorders = { ...mockCountry, borders: null };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [countryWithNullBorders]
    });

    const { result } = renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.country).toEqual(countryWithNullBorders);
    expect(result.current.neighbors).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  test('should handle country with undefined borders', async () => {
    const countryWithUndefinedBorders = { ...mockCountry, borders: undefined };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [countryWithUndefinedBorders]
    });

    const { result } = renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.country).toEqual(countryWithUndefinedBorders);
    expect(result.current.neighbors).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  test('should handle fetch error for country', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.country).toBe(null);
    expect(result.current.neighbors).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  test('should handle non-OK response for country', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const { result } = renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.country).toBe(null);
    expect(result.current.neighbors).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch country');
  });

  test('should handle non-OK response for neighbors', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCountry]
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500
      });

    const { result } = renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.country).toEqual(mockCountry);
    expect(result.current.neighbors).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  test('should handle fetch error for neighbors', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCountry]
      })
      .mockRejectedValueOnce(new Error('Neighbors fetch error'));

    const { result } = renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.country).toEqual(mockCountry);
    expect(result.current.neighbors).toEqual([]);
    // When neighbors fetch fails, the error should be set since it's within the same try-catch block
    expect(result.current.error).toBe('Neighbors fetch error');
  });

  test('should not fetch when countryCode is null', () => {
    renderHook(() => useCountryDetail(null));

    expect(fetch).not.toHaveBeenCalled();
  });

  test('should not fetch when countryCode is undefined', () => {
    renderHook(() => useCountryDetail(undefined));

    expect(fetch).not.toHaveBeenCalled();
  });

  test('should not fetch when countryCode is empty string', () => {
    renderHook(() => useCountryDetail(''));

    expect(fetch).not.toHaveBeenCalled();
  });

  test('should refetch when refetch is called', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCountry]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockNeighbors
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCountry]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockNeighbors
      });

    const { result } = renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(4); // Initial fetch + neighbors + refetch + neighbors
  });

  test('should clear error when refetching', async () => {
    fetch
      .mockRejectedValueOnce(new Error('Initial error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCountry]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockNeighbors
      });

    const { result } = renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Initial error');

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    expect(result.current.error).toBe(null);
  });

  test('should use correct API endpoints', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCountry]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockNeighbors
      });

    renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    // Check that the correct API endpoints are used (with full URLs)
    expect(fetch).toHaveBeenNthCalledWith(1, 'https://restcountries.com/v3.1/alpha/US');
    expect(fetch).toHaveBeenNthCalledWith(2, 'https://restcountries.com/v3.1/alpha?codes=CAN,MEX&fields=name,cca3,flags');
  });

  test('should handle country with single border', async () => {
    const countryWithSingleBorder = { ...mockCountry, borders: ['CAN'] };
    const singleNeighbor = [{ name: { common: 'Canada' }, cca3: 'CAN' }];
    
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [countryWithSingleBorder]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => singleNeighbor
      });

    const { result } = renderHook(() => useCountryDetail('US'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.country).toEqual(countryWithSingleBorder);
    expect(result.current.neighbors).toEqual(singleNeighbor);
  });
});
