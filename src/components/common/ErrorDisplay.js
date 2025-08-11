import React from 'react';
import styles from './ErrorDisplay.module.css';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className={styles.errorDisplay}>
      <div className={styles.errorIcon}>⚠️</div>
      <h3 className={styles.errorTitle}>Error</h3>
      <p className={styles.errorMessage}>{error}</p>
      {onRetry && (
        <button className={styles.errorRetryBtn} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay; 