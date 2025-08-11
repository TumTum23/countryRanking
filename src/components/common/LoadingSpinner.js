import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingMessage}>{message}</p>
    </div>
  );
};

export default LoadingSpinner; 