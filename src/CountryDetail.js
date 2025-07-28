import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CountryDetail.css';

function CountryDetail() {
  const { countryCode } = useParams();
  const [country, setCountry] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCountry() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        if (!res.ok) throw new Error('Failed to fetch country');
        const data = await res.json();
        setCountry(data[0]);
        // Fetch neighbors if borders exist
        if (data[0].borders && data[0].borders.length > 0) {
          const bordersRes = await fetch(`https://restcountries.com/v3.1/alpha?codes=${data[0].borders.join(',')}&fields=name,cca3,flags`);
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
    }
    fetchCountry();
  }, [countryCode]);

  const handleNeighborClick = (cca3) => {
    navigate(`/country/${cca3}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <section className="country-detail">
      <div className="country-detail-content">
        <button className="back-btn" onClick={handleBack}>Back</button>
        {loading && <p>Loading country details...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && country && (
          <>
            <div className="country-detail-header">
              <img src={country.flags?.svg} alt={country.name.common + ' flag'} style={{width: '72px', height: '48px', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}} />
              <h2>{country.name.common}</h2>
            </div>
            <div className="country-detail-info">
              <div><strong>Population:</strong> {country.population?.toLocaleString() || '-'}</div>
              <div><strong>Area:</strong> {country.area?.toLocaleString() || '-'} km²</div>
              <div><strong>Capital:</strong> {country.capital ? country.capital.join(', ') : '-'}</div>
              <div><strong>Region:</strong> {country.region || '-'}</div>
              <div><strong>Subregion:</strong> {country.subregion || '-'}</div>
              <div><strong>Member of UN:</strong> {country.unMember ? 'Yes' : 'No'}</div>
              <div><strong>Independent:</strong> {country.independent ? 'Yes' : 'No'}</div>
            </div>
            <div className="country-detail-neighbors">
              <strong>Neighboring Countries:</strong>
              {neighbors.length === 0 ? (
                <span> None</span>
              ) : (
                <div className="neighbor-list">
                  {neighbors.map(n => (
                    <button key={n.cca3} className="neighbor-pill" onClick={() => handleNeighborClick(n.cca3)}>
                      <img src={n.flags?.svg} alt={n.name.common + ' flag'} style={{width: '28px', height: '18px', objectFit: 'cover', marginRight: '0.7em', borderRadius: '4px'}} />
                      {n.name.common}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default CountryDetail; 