import React from 'react';
import styles from './NeighborList.module.css';

const NeighborList = React.memo(({ neighbors, onNeighborClick }) => {
  return (
    <div className={styles.countryDetailNeighbors}>
      <strong>Neighboring Countries:</strong>
      {neighbors.length === 0 ? (
        <span> None</span>
      ) : (
        <div className={styles.neighborList}>
          {neighbors.map(neighbor => (
            <button 
              key={neighbor.cca3} 
              className={styles.neighborPill} 
              onClick={() => onNeighborClick(neighbor.cca3)}
            >
              <img 
                src={neighbor.flags?.svg} 
                alt={neighbor.name.common + ' flag'} 
                style={{
                  width: '28px', 
                  height: '18px', 
                  objectFit: 'cover', 
                  marginRight: '0.7em', 
                  borderRadius: '4px'
                }} 
              />
              {neighbor.name.common}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default NeighborList; 