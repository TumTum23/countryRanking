import React, { useState, useEffect } from 'react';
import './CountryRanking.css';
import { useNavigate } from 'react-router-dom';

const SORT_OPTIONS = [
  { value: 'population', label: 'Population' },
  { value: 'name', label: 'Name' },
  { value: 'area', label: 'Area' },
];

const REGIONS = [
  'Americas', 'Antarctic', 'Africa', 'Asia', 'Europe', 'Oceania'
];

const PAGE_SIZE = 50;

function CountryRanking() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('population');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [filterUN, setFilterUN] = useState(false);
  const [filterIndependent, setFilterIndependent] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCountries() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,population,region,subregion,cca3,flags,area,unMember,independent');
        if (!res.ok) throw new Error('Failed to fetch countries');
        let data = await res.json();
        setCountries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  // Filtering logic
  const filteredCountries = React.useMemo(() => {
    let filtered = [...countries];
    if (selectedRegions.length > 0) {
      filtered = filtered.filter(c => selectedRegions.includes(c.region));
    }
    if (filterUN) {
      filtered = filtered.filter(c => c.unMember);
    }
    if (filterIndependent) {
      filtered = filtered.filter(c => c.independent);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(c =>
        c.name.common.toLowerCase().includes(s) ||
        (c.region && c.region.toLowerCase().includes(s)) ||
        (c.subregion && c.subregion.toLowerCase().includes(s))
      );
    }
    return filtered;
  }, [countries, selectedRegions, filterUN, filterIndependent, search]);

  // Sort countries based on sortBy
  const sortedCountries = React.useMemo(() => {
    let sorted = [...filteredCountries];
    if (sortBy === 'population') {
      sorted.sort((a, b) => b.population - a.population);
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } else if (sortBy === 'area') {
      sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
    }
    return sorted;
  }, [filteredCountries, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(sortedCountries.length / PAGE_SIZE);
  const paginatedCountries = viewAll
    ? sortedCountries
    : sortedCountries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));
  const handleViewAll = () => setViewAll(true);
  const handlePaginate = () => setViewAll(false);

  // Reset to page 1 or viewAll off when filters/search change
  React.useEffect(() => {
    setPage(1);
    setViewAll(false);
  }, [sortBy, selectedRegions, filterUN, filterIndependent, search]);

  // Handlers
  const toggleRegion = region => {
    setSelectedRegions(regions =>
      regions.includes(region)
        ? regions.filter(r => r !== region)
        : [...regions, region]
    );
  };

  const handleRowClick = (countryCode) => {
    navigate(`/country/${countryCode}`);
  };

  return (
    <section className="country-ranking">
      <div className="mobile-header">
        <h1 className="mobile-title">World Ranks</h1>
        <div className="mobile-earth-bg"></div>
      </div>
      <div className="country-list-card">
        <div className="main-container">
          <div className="ranking-layout">
            {/* First container: Country count for desktop */}
            <div className="desktop-country-count-container">
              <div className="country-count desktop-only">Found {sortedCountries.length} countries</div>
              <div className="search-container desktop-only">
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  className="country-search"
                  type="text"
                  placeholder="Search by Name, Region, Subregion"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            {/* Second container: Filters and content */}
            <div className="desktop-content-container">
              <aside className="ranking-sidebar">
                <div className="mobile-header-row">
                  <div className="mobile-header-content">
                    <div className="country-count">Found {sortedCountries.length} countries</div>
                    <div className="search-container mobile-only">
                      <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <input
                        className="country-search"
                        type="text"
                        placeholder="Search by Name, Region, Subregion"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="sidebar-controls">
                  <div className="sidebar-control">
                    <label htmlFor="sort-select">Sort by:</label>
                    <div className="custom-select-wrapper">
                      <select
                        id="sort-select"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                      >
                        {SORT_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <span className="custom-select-arrow" />
                    </div>
                  </div>
                  <div className="sidebar-control">
                    <span>Region:</span>
                    <div className="region-pills">
                      {REGIONS.map(region => (
                        <button
                          key={region}
                          type="button"
                          className={selectedRegions.includes(region) ? 'pill selected' : 'pill'}
                          onClick={() => toggleRegion(region)}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sidebar-control">
                    <span>Status:</span>
                    <div className="status-controls">
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={filterUN}
                          onChange={e => setFilterUN(e.target.checked)}
                        />
                        <span className="custom-checkbox-box" />
                        Member of the United Nations
                      </label>
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={filterIndependent}
                          onChange={e => setFilterIndependent(e.target.checked)}
                        />
                        <span className="custom-checkbox-box" />
                        Independent
                      </label>
                    </div>
                  </div>
                </div>
              </aside>
              <div className="ranking-main">
                {loading && <p>Loading countries...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && (
                  <>
                    <div className="country-table-wrapper">
                      <table className="country-table">
                        <thead>
                          <tr>
                            <th>Flag</th>
                            <th>Name</th>
                            <th>Population</th>
                            <th>Area (km²)</th>
                            <th>Region</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedCountries.map((country) => (
                            <tr key={country.cca3} className="clickable-row" onClick={() => handleRowClick(country.cca3)} style={{cursor: 'pointer'}}>
                              <td><img src={country.flags?.svg} alt={country.name.common + ' flag'} style={{width: '32px', height: '20px', objectFit: 'cover'}} /></td>
                              <td>{country.name.common}</td>
                              <td>{country.population.toLocaleString()}</td>
                              <td>{country.area ? country.area.toLocaleString() : '-'}</td>
                              <td>{country.region}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="pagination-controls">
                      {!viewAll && totalPages > 1 && (
                        <>
                          <button onClick={handlePrev} disabled={page === 1} className="pagination-btn">&laquo;</button>
                          <span className="pagination-info">Page {page} of {totalPages}</span>
                          <button onClick={handleNext} disabled={page === totalPages} className="pagination-btn">&raquo;</button>
                          <button onClick={handleViewAll} className="pagination-btn view-all-btn">View All</button>
                        </>
                      )}
                      {viewAll && (
                        <button onClick={handlePaginate} className="pagination-btn view-all-btn">Show Paginated</button>
                      )}
                    </div>
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