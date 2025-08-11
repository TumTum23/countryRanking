import React from 'react';
import styles from './CountryInfo.module.css';

const CountryInfo = ({ country }) => {
  if (!country) return null;

  return (
    <div className={styles.countryDetailInfo}>
      <div><strong>Population:</strong> {country.population?.toLocaleString() || '-'}</div>
      <div><strong>Area:</strong> {country.area?.toLocaleString() || '-'} km²</div>
      <div><strong>Capital:</strong> {country.capital ? country.capital.join(', ') : '-'}</div>
      <div><strong>Region:</strong> {country.region || '-'}</div>
      <div><strong>Subregion:</strong> {country.subregion || '-'}</div>
      <div><strong>Member of UN:</strong> {country.unMember ? 'Yes' : 'No'}</div>
      <div><strong>Independent:</strong> {country.independent ? 'Yes' : 'No'}</div>
    </div>
  );
};

export default CountryInfo; 