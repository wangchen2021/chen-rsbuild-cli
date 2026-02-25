// 带颜色的日志函数（保留原逻辑）
export const log = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    reset: '\x1b[0m',
  };
  console.log(`${colors[type]}[API Generate]${colors.reset} ${message}`);
};
