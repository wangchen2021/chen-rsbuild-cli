import React from 'react';
import styles from './index.scss';

interface TechHeaderProps {
  title: string;
  subtitle: string;
  tagline: string;
}

const TechHeader: React.FC<TechHeaderProps> = ({ title, subtitle, tagline }) => {
  return (
    <div className={styles['tech-header']}>
      <div className={styles['tech-glow']}></div>
      <h1 className={styles['tech-title']}>
        <span className={styles['tech-gradient']}>{title}</span>
        <span className={styles['tech-subtitle']}>{subtitle}</span>
      </h1>
      <p className={styles['tech-tagline']}>{tagline}</p>
    </div>
  );
};

export default TechHeader;
