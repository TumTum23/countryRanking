import React from 'react';
import styles from './CountryHeader.module.css';

const CountryHeader = ({ country }) => {
  if (!country) return null;

  return (
    <div className={styles.countryDetailHeader}>
      <img 
        src={country.flags?.svg} 
        alt={country.name.common + ' flag'} 
        style={{
          width: '72px', 
          height: '48px', 
          objectFit: 'cover', 
          borderRadius: '6px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }} 
      />
      <h2>{country.name.common}</h2>
    </div>
  );
};

export default CountryHeader; 