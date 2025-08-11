import React from 'react';
import styles from './PaginationControls.module.css';

const PaginationControls = React.memo(({
  page,
  totalPages,
  viewAll,
  onPrev,
  onNext,
  onViewAll,
  onPaginate
}) => {
  return (
    <div className={styles.paginationControls}>
      {!viewAll && totalPages > 1 && (
        <>
          <button
            onClick={onPrev}
            disabled={page === 1}
            className={styles.paginationBtn}
          >
            &laquo;
          </button>
          <span className={styles.paginationInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={onNext}
            disabled={page === totalPages}
            className={styles.paginationBtn}
          >
            &raquo;
          </button>
          <button
            onClick={onViewAll}
            className={`${styles.paginationBtn} ${styles.viewAllBtn}`}
          >
            View All
          </button>
        </>
      )}
      {viewAll && (
        <button
          onClick={onPaginate}
          className={`${styles.paginationBtn} ${styles.viewAllBtn}`}
        >
          Show Paginated
        </button>
      )}
    </div>
  );
});

export default PaginationControls; 