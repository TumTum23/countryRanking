import React from 'react';
import styles from './BackButton.module.css';

const BackButton = React.memo(({ onClick, children = 'Back' }) => {
  return (
    <button className={styles.backBtn} onClick={onClick}>
      {children}
    </button>
  );
});

export default BackButton; 