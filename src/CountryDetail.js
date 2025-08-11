import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CountryDetail.css';
import { BackButton, CountryHeader, CountryInfo, NeighborList } from './components/country';
import { LoadingSpinner, ErrorDisplay } from './components/common';
import { useCountryDetail } from './hooks';

function CountryDetail() {
  const { countryCode } = useParams();
  const { country, neighbors, loading, error, refetch } = useCountryDetail(countryCode);
  const navigate = useNavigate();

  const handleNeighborClick = useCallback((cca3) => {
    navigate(`/country/${cca3}`);
  }, [navigate]);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <section className="country-detail">
      <div className="country-detail-content">
        <BackButton onClick={handleBack} />
        {loading && <LoadingSpinner message="Loading country details..." />}
        {error && <ErrorDisplay error={error} onRetry={refetch} />}
        {!loading && !error && country && (
          <>
            <CountryHeader country={country} />
            <CountryInfo country={country} />
            <NeighborList neighbors={neighbors} onNeighborClick={handleNeighborClick} />
          </>
        )}
      </div>
    </section>
  );
}

export default CountryDetail; 