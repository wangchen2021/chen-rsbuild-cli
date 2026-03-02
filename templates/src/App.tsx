import { useEffect, useState } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { increment } from './store/slices/test';
import MyButton from './components/MyButton';
import { postLogin } from './api';

const App = () => {
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

  const test = () => {
    dispatch(increment());
  };

  const login = () => {
    postLogin({
      username: 'admin',
      password: '123456',
    });
  };

  return (
    <div className="app-container">
      {/* 粒子背景 */}
      <div className="particles-container">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="particle"
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

      {/* 主内容区域 */}
      <div className="content">
        {/* 科技感标题 */}
        <div className="tech-header">
          <div className="tech-glow"></div>
          <h1 className="tech-title">
            <span className="tech-gradient">RSBUILD</span>
            <span className="tech-subtitle">ENTERPRISE</span>
          </h1>
          <p className="tech-tagline">Next-Generation React Development Platform</p>
        </div>

        {/* 状态卡片 */}
        <div className="dashboard">
          <div className="dashboard-card">
            <div className="card-icon">⚡</div>
            <h3>Ultra Fast</h3>
            <p>Lightning-fast builds with RSBuild</p>
            <div className="card-stats">
              <span className="stat-value">0.5s</span>
              <span className="stat-label">HMR</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🔒</div>
            <h3>Enterprise Ready</h3>
            <p>Production-grade architecture</p>
            <div className="card-stats">
              <span className="stat-value">100%</span>
              <span className="stat-label">Type Safe</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🚀</div>
            <h3>Modern Stack</h3>
            <p>React 18 + TypeScript + RSBuild</p>
            <div className="card-stats">
              <span className="stat-value">v18</span>
              <span className="stat-label">React</span>
            </div>
          </div>
        </div>

        {/* 交互区域 */}
        <div className="interactive-section">
          <div className="counter-panel">
            <h3>System Status</h3>
            <div className="counter-display">
              <div className="counter-value">{count}</div>
              <div className="counter-label">Active Sessions</div>
            </div>
            <button className="tech-button primary" onClick={test}>
              <span className="button-glow"></span>
              Increment Counter
            </button>
          </div>

          <div className="action-panel">
            <h3>Quick Actions</h3>
            <div className="button-group">
              <button className="tech-button secondary">
                <span className="button-icon">📊</span>
                View Analytics
              </button>
              <MyButton text="Custom Component" />
              <button className="tech-button accent" onClick={login}>
                <span className="button-icon">🔐</span>
                API Test
              </button>
            </div>
          </div>
        </div>

        {/* 终端样式提示 */}
        <div className="terminal-prompt">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="terminal-title">terminal</span>
          </div>
          <div className="terminal-content">
            <p>
              $ <span className="command">npm run dev</span>
            </p>
            <p className="terminal-output">🚀 Server running at http://localhost:3000</p>
            <p className="terminal-output">⚡ HMR enabled • TypeScript ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
