import React from 'react';
import styles from './index.scss';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface ParticlesBackgroundProps {
  particles: Particle[];
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ particles }) => {
  return (
    <div className={styles['particles-container']}>
      {particles.map((particle, index) => (
        <div
          key={index}
          className={styles['particle']}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${5 / particle.speed}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticlesBackground;
