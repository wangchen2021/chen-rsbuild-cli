import React from 'react';
import DashboardCard from '../DashboardCard';
import styles from './index.scss';

const Dashboard: React.FC = () => {
  const cards = [
    {
      icon: '⚡',
      title: 'Ultra Fast',
      description: 'Lightning-fast builds with RSBuild',
      statValue: '0.5s',
      statLabel: 'HMR',
    },
    {
      icon: '🔒',
      title: 'Enterprise Ready',
      description: 'Production-grade architecture',
      statValue: '100%',
      statLabel: 'Type Safe',
    },
    {
      icon: '🚀',
      title: 'Modern Stack',
      description: 'React 19 + TypeScript + RSBuild',
      statValue: 'v19',
      statLabel: 'React',
    },
  ];

  return (
    <div className={styles.dashboard}>
      {cards.map((card, index) => (
        <DashboardCard
          key={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
          statValue={card.statValue}
          statLabel={card.statLabel}
        />
      ))}
    </div>
  );
};

export default Dashboard;
