import { useState, useMemo, useEffect, useCallback } from 'react';
import { PAGE_SIZE } from '../utils/constants';

export const useCountryPagination = (sortedCountries) => {
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  // Reset to page 1 when filters/sorting change
  useEffect(() => {
    setPage(1);
    setViewAll(false);
  }, [sortedCountries]);

  const paginatedCountries = useMemo(() => {
    // Handle null/undefined countries gracefully
    if (!sortedCountries || !Array.isArray(sortedCountries)) {
      return [];
    }
    
    if (viewAll) {
      return sortedCountries;
    }
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return sortedCountries.slice(startIndex, endIndex);
  }, [sortedCountries, page, viewAll]);

  const totalPages = Math.ceil((sortedCountries?.length || 0) / PAGE_SIZE);

  const handlePrev = useCallback(() => {
    setPage(p => Math.max(1, p - 1));
  }, []);

  const handleNext = useCallback(() => {
    setPage(p => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const handleViewAll = useCallback(() => {
    setViewAll(true);
  }, []);

  const handlePaginate = useCallback(() => {
    setViewAll(false);
  }, []);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  // Override setPage to add validation
  const setPageWithValidation = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  return {
    paginatedCountries,
    page,
    setPage: setPageWithValidation, // Use validated version
    viewAll,
    setViewAll,
    totalPages,
    handlePrev,
    handleNext,
    handleViewAll,
    handlePaginate,
    goToPage
  };
}; 