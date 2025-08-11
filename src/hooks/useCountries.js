import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../utils/constants';

export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ENDPOINTS.ALL_COUNTRIES);
      if (!res.ok) throw new Error('Failed to fetch countries');
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return {
    countries,
    loading,
    error,
    refetch: fetchCountries,
  };
}; 