import { useState, useMemo, useCallback } from 'react';

export const useCountryFilters = (countries) => {
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [filterUN, setFilterUN] = useState(false);
  const [filterIndependent, setFilterIndependent] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCountries = useMemo(() => {
    // Handle null/undefined countries gracefully
    if (!countries || !Array.isArray(countries)) {
      return [];
    }
    
    let filtered = [...countries];
    
    // Filter by selected regions
    if (selectedRegions.length > 0) {
      filtered = filtered.filter(c => selectedRegions.includes(c.region));
    }
    
    // Filter by UN membership
    if (filterUN) {
      filtered = filtered.filter(c => c.unMember);
    }
    
    // Filter by independence
    if (filterIndependent) {
      filtered = filtered.filter(c => c.independent);
    }
    
    // Filter by search term
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      filtered = filtered.filter(c =>
        c.name.common.toLowerCase().includes(searchTerm) ||
        (c.region && c.region.toLowerCase().includes(searchTerm)) ||
        (c.subregion && c.subregion.toLowerCase().includes(searchTerm))
      );
    }
    
    return filtered;
  }, [countries, selectedRegions, filterUN, filterIndependent, search]);

  const toggleRegion = useCallback((region) => {
    setSelectedRegions(regions =>
      regions.includes(region)
        ? regions.filter(r => r !== region)
        : [...regions, region]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedRegions([]);
    setFilterUN(false);
    setFilterIndependent(false);
    setSearch('');
  }, []);

  return {
    filteredCountries,
    selectedRegions,
    setSelectedRegions,
    filterUN,
    setFilterUN,
    filterIndependent,
    setFilterIndependent,
    search,
    setSearch,
    toggleRegion,
    resetFilters
  };
}; 