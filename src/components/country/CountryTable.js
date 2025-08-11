import React from 'react';
import styles from './CountryTable.module.css';

const CountryTable = React.memo(({ countries, onRowClick }) => {
  return (
    <div className={styles.countryTableWrapper}>
      <table className={styles.countryTable}>
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
          {countries.map((country) => (
            <tr
              key={country.cca3}
              className={styles.clickableRow}
              onClick={() => onRowClick(country.cca3)}
              style={{cursor: 'pointer'}}
            >
              <td>
                <img
                  src={country.flags?.svg}
                  alt={country.name.common + ' flag'}
                  style={{
                    width: '32px',
                    height: '20px',
                    objectFit: 'cover'
                  }}
                />
              </td>
              <td>{country.name.common}</td>
              <td>{country.population.toLocaleString()}</td>
              <td>{country.area ? country.area.toLocaleString() : '-'}</td>
              <td>{country.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default CountryTable; 