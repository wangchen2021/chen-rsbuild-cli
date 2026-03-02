import React from 'react';
import styles from './index.scss';

const TerminalPrompt: React.FC = () => {
  return (
    <div className={styles['terminal-prompt']}>
      <div className={styles['terminal-header']}>
        <div className={styles['terminal-dots']}>
          <span className={styles['dot red']}></span>
          <span className={styles['dot yellow']}></span>
          <span className={styles['dot green']}></span>
        </div>
        <span className={styles['terminal-title']}>terminal</span>
      </div>
      <div className={styles['terminal-content']}>
        <p>
          $ <span className={styles['command']}>npm run dev</span>
        </p>
        <p className={styles['terminal-output']}>🚀 Server running at http://localhost:3000</p>
        <p className={styles['terminal-output']}>⚡ HMR enabled • TypeScript ready</p>
      </div>
    </div>
  );
};

export default TerminalPrompt;
