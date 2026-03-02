import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { increment } from '../../store/slices/test';
import { postLogin } from '../../api';

// Components
import TechHeader from '../../components/TechHeader';
import Dashboard from '../../components/Dashboard';
import InteractiveSection from '../../components/InteractiveSection';
import TerminalPrompt from '../../components/TerminalPrompt';
import ParticlesBackground from '../../components/ParticlesBackground';

// Styles
import styles from './index.scss';

const IndexPage = () => {
  const count = useAppSelector((state) => state.test.count);
  const dispatch = useAppDispatch();
  const [particles, _setParticles] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
    }>
  >(() => {
    const initialParticles = [];
    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    return initialParticles;
  });

  useEffect(() => {
    console.log(ENV_CONFIG);
  }, []);

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleLogin = () => {
    postLogin({
      username: 'admin',
      password: '123456',
    });
  };

  return (
    <div className={styles['index-container']}>
      {/* 粒子背景 */}
      <ParticlesBackground particles={particles} />

      {/* 主内容区域 */}
      <div className={styles['index-content']}>
        {/* 科技感标题 */}
        <TechHeader
          title="CHEN RSBUILD"
          subtitle="ENTERPRISE"
          tagline="Next-Generation React Development Platform"
        />

        {/* 仪表板卡片 */}
        <Dashboard />

        {/* 交互区域 */}
        <InteractiveSection count={count} onIncrement={handleIncrement} onLogin={handleLogin} />

        {/* 终端样式提示 */}
        <TerminalPrompt />
      </div>
    </div>
  );
};

export default IndexPage;
