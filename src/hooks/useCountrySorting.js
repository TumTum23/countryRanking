import { useState, useMemo } from 'react';

export const useCountrySorting = (filteredCountries) => {
  const [sortBy, setSortBy] = useState('population');

  const sortedCountries = useMemo(() => {
    // Handle null/undefined countries gracefully
    if (!filteredCountries || !Array.isArray(filteredCountries)) {
      return [];
    }
    
    let sorted = [...filteredCountries];
    
    switch (sortBy) {
      case 'population':
        sorted.sort((a, b) => b.population - a.population);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.common.localeCompare(b.name.common));
        break;
      case 'area':
        sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
        break;
      default:
        // Default to population sorting
        sorted.sort((a, b) => b.population - a.population);
    }
    
    return sorted;
  }, [filteredCountries, sortBy]);

  return {
    sortedCountries,
    sortBy,
    setSortBy
  };
}; 