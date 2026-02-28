/** 企业级：路径处理工具（兼容所有运行环境） */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

/** 获取 CLI 根目录（兼容开发/链接/全局安装） */
export const getCliRootDir = (): string => {
  // 1. 开发环境（ts-node 运行 .ts 文件）
  if (process.env.NODE_ENV === 'development' || __filename.endsWith('.ts')) {
    return path.resolve(__dirname, '../../');
  }

  // 2. 生产环境（编译后 .js 文件，全局链接/安装）
  const cliEntryPath = require.main?.filename || __filename;
  let cliRootDir = path.resolve(path.dirname(cliEntryPath), '../');

  // 校验：确认是 CLI 根目录（兼容 pnpm 全局目录结构）
  const pkgPath = path.resolve(cliRootDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    cliRootDir = path.resolve(path.dirname(cliEntryPath), '../../');
  }

  return cliRootDir;
};

/** 确保目录存在，不存在则创建 */
export const ensureDir = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
