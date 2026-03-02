import React from 'react';
import MyButton from '../MyButton';
import styles from './index.scss';

interface InteractiveSectionProps {
  count: number;
  onIncrement: () => void;
  onLogin: () => void;
}

const InteractiveSection: React.FC<InteractiveSectionProps> = ({ count, onIncrement, onLogin }) => {
  return (
    <div className={styles['interactive-section']}>
      <div className={styles['counter-panel']}>
        <h3>System Status</h3>
        <div className={styles['counter-display']}>
          <div className={styles['counter-value']}>{count}</div>
          <div className={styles['counter-label']}>Active Sessions</div>
        </div>
        <button className={styles['tech-button']} onClick={onIncrement}>
          <span className={styles['button-glow']}></span>
          Increment Counter
        </button>
      </div>

      <div className={styles['action-panel']}>
        <h3>Quick Actions</h3>
        <div className={styles['button-group']}>
          <button className={styles['tech-button']}>
            <span className={styles['button-icon']}>📊</span>
            View Analytics
          </button>
          <MyButton text="Custom Component" />
          <button className={styles['tech-button'] + ' ' + styles['accent']} onClick={onLogin}>
            <span className={styles['button-icon']}>🔐</span>
            API Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveSection;
