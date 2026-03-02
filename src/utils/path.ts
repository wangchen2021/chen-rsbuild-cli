/** 企业级：路径处理工具（兼容所有运行环境） */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

/** 获取当前模块的目录名（替代 CommonJS 的 __dirname） */
const getCurrentDirname = () => {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);
};

/** 获取 CLI 根目录（兼容开发/链接/全局安装） */
export const getCliRootDir = (): string => {
  // 1. 开发环境（ts-node 运行 .ts 文件）
  const currentDir = getCurrentDirname();
  const isDevEnv = process.env.NODE_ENV === 'development' || currentDir.includes('.ts');

  if (isDevEnv) {
    // ESM 格式替代 __dirname: ../../ → 指向 CLI 根目录
    return path.resolve(currentDir, '../../');
  }

  // 2. 生产环境（编译后 .js 文件，全局链接/安装）
  // ESM 中替代 require.main?.filename：使用 process.argv[1] 获取入口文件路径
  const cliEntryPath = process.argv[1] || fileURLToPath(import.meta.url);
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
