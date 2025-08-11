import React, { useCallback } from 'react';
import './CountryRanking.css';
import { useNavigate } from 'react-router-dom';
import { SearchBar, FilterSidebar, CountryTable, PaginationControls } from './components/country';
import { LoadingSpinner, ErrorDisplay } from './components/common';
import { useCountries, useCountryFilters, useCountrySorting, useCountryPagination } from './hooks';
import { SORT_OPTIONS, REGIONS } from './utils/constants';

function CountryRanking() {
  const { countries, loading, error, refetch } = useCountries();
  const navigate = useNavigate();

  // Use custom hooks for business logic
  const {
    filteredCountries,
    selectedRegions,
    filterUN,
    filterIndependent,
    search,
    setSearch,
    toggleRegion,
    setFilterUN,
    setFilterIndependent
  } = useCountryFilters(countries);

  const {
    sortedCountries,
    sortBy,
    setSortBy
  } = useCountrySorting(filteredCountries);

  const {
    paginatedCountries,
    page,
    totalPages,
    viewAll,
    handlePrev,
    handleNext,
    handleViewAll,
    handlePaginate
  } = useCountryPagination(sortedCountries);

  const handleRowClick = useCallback((countryCode) => {
    navigate(`/country/${countryCode}`);
  }, [navigate]);

  return (
    <section className="country-ranking">
      <div className="mobile-header">
        <h1 className="mobile-title">World Ranks</h1>
        <div className="mobile-earth-bg"></div>
      </div>
      <div className="country-list-card">
        <div className="main-container">
          <div className="ranking-layout">
            <div className="desktop-country-count-container">
              <div className="country-count desktop-only">Found {sortedCountries.length} countries</div>
              <SearchBar 
                search={search}
                onSearchChange={useCallback(e => setSearch(e.target.value), [setSearch])}
                className="desktop-only"
              />
            </div>
            
            
            <div className="desktop-content-container">
              <aside className="ranking-sidebar">
                <div className="mobile-header-row">
                  <div className="mobile-header-content">
                    <div className="country-count">Found {sortedCountries.length} countries</div>
                    <SearchBar 
                      search={search}
                      onSearchChange={useCallback(e => setSearch(e.target.value), [setSearch])}
                      className="mobile-only"
                    />
                  </div>
                </div>
                <FilterSidebar
                  sortBy={sortBy}
                  onSortChange={useCallback(e => setSortBy(e.target.value), [setSortBy])}
                  selectedRegions={selectedRegions}
                  onRegionToggle={toggleRegion}
                  filterUN={filterUN}
                  onFilterUNChange={useCallback(e => setFilterUN(e.target.checked), [setFilterUN])}
                  filterIndependent={filterIndependent}
                  onFilterIndependentChange={useCallback(e => setFilterIndependent(e.target.checked), [setFilterIndependent])}
                />
              </aside>
              <div className="ranking-main">
                {loading && <LoadingSpinner message="Loading countries..." />}
                {error && <ErrorDisplay error={error} onRetry={refetch} />}
                {!loading && !error && (
                  <>
                    <CountryTable 
                      countries={paginatedCountries}
                      onRowClick={handleRowClick}
                    />
                    <PaginationControls
                      page={page}
                      totalPages={totalPages}
                      viewAll={viewAll}
                      onPrev={handlePrev}
                      onNext={handleNext}
                      onViewAll={handleViewAll}
                      onPaginate={handlePaginate}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CountryRanking; 