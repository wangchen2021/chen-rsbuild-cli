import React from 'react';
import styles from './index.scss';

interface DashboardCardProps {
  icon: string;
  title: string;
  description: string;
  statValue: string;
  statLabel: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  description,
  statValue,
  statLabel,
}) => {
  return (
    <div className={styles['dashboard-card']}>
      <div className={styles['card-icon']}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={styles['card-stats']}>
        <span className={styles['stat-value']}>{statValue}</span>
        <span className={styles['stat-label']}>{statLabel}</span>
      </div>
    </div>
  );
};

export default DashboardCard;
