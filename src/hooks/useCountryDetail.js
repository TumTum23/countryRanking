import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../utils/constants';

export const useCountryDetail = (countryCode) => {
  const [country, setCountry] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCountry = async () => {
    if (!countryCode) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ENDPOINTS.COUNTRY_BY_CODE(countryCode));
      if (!res.ok) throw new Error('Failed to fetch country');
      const data = await res.json();
      setCountry(data[0]);
      
      // Fetch neighbors if borders exist
      if (data[0].borders && data[0].borders.length > 0) {
        const bordersRes = await fetch(API_ENDPOINTS.COUNTRIES_BY_CODES(data[0].borders));
        if (bordersRes.ok) {
          const bordersData = await bordersRes.json();
          setNeighbors(bordersData);
        }
      } else {
        setNeighbors([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountry();
  }, [countryCode]);

  return {
    country,
    neighbors,
    loading,
    error,
    refetch: fetchCountry,
  };
}; 