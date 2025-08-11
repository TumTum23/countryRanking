import React from 'react';
import styles from './FilterSidebar.module.css';
import { SORT_OPTIONS, REGIONS } from '../../utils/constants';

const FilterSidebar = ({
  sortBy,
  onSortChange,
  selectedRegions,
  onRegionToggle,
  filterUN,
  onFilterUNChange,
  filterIndependent,
  onFilterIndependentChange
}) => {
  return (
    <div className={styles.sidebarControls}>
      <div className={styles.sidebarControl}>
        <label htmlFor="sort-select">Sort by:</label>
        <div className={styles.customSelectWrapper}>
          <select
            id="sort-select"
            value={sortBy}
            onChange={onSortChange}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className={styles.customSelectArrow} />
        </div>
      </div>
      
      <div className={styles.sidebarControl}>
        <span>Region:</span>
        <div className={styles.regionPills}>
          {REGIONS.map(region => (
            <button
              key={region}
              type="button"
              className={selectedRegions.includes(region) ? `${styles.pill} ${styles.selected}` : styles.pill}
              onClick={() => onRegionToggle(region)}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.sidebarControl}>
        <span>Status:</span>
        <div className={styles.statusControls}>
          <label className={styles.customCheckbox}>
            <input
              type="checkbox"
              checked={filterUN}
              onChange={onFilterUNChange}
            />
            <span className={styles.customCheckboxBox} />
            Member of the United Nations
          </label>
          <label className={styles.customCheckbox}>
            <input
              type="checkbox"
              checked={filterIndependent}
              onChange={onFilterIndependentChange}
            />
            <span className={styles.customCheckboxBox} />
            Independent
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar; 