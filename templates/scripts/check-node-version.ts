// scripts/check-env.ts 【企业级最终版：ESModule+TS+Node+pnpm双校验+自定义提示】
import { readFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import semver from 'semver';

// 直接使用fileURLToPath获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前目录路径（scripts目录）
const __dirname = dirname(__filename);
// 获取项目根目录路径（scripts的父目录）
const projectRoot = resolve(__dirname, '..');
const COLOR = {
  RED: '\x1B[31m',
  GREEN: '\x1B[32m',
  YELLOW: '\x1B[33m',
  RESET: '\x1B[0m',
};

// 使用projectRoot计算package.json路径
const packageJsonPath = join(projectRoot, 'package.json');
if (!existsSync(packageJsonPath)) {
  console.error(`${COLOR.RED}【环境校验失败】未找到package.json文件！${COLOR.RESET}`);
  console.error(`${COLOR.YELLOW}当前目录: ${COLOR.RESET} ${process.cwd()}`);
  console.error(`${COLOR.YELLOW}计算路径: ${COLOR.RESET} ${packageJsonPath}`);
  process.exit(1);
}

let packageJson: any;
try {
  packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
} catch (err) {
  console.error(err);
  console.error(
    `${COLOR.RED}【环境校验失败】package.json文件解析失败，请检查文件格式！${COLOR.RESET}`,
  );
  process.exit(1);
}

// ===================== 核心步骤2：TS类型约束 + 校验engines配置 =====================
interface ProjectEngines {
  node: string;
  pnpm: string;
}
const engines = packageJson.engines as ProjectEngines;
const packageManager = packageJson.packageManager as string;

// 校验engines字段是否完整配置
if (!engines?.node) {
  console.error(
    `${COLOR.RED}【环境校验失败】package.json 中未配置 engines.node 字段，请补充！${COLOR.RESET}`,
  );
  process.exit(1);
}
if (!engines?.pnpm) {
  console.error(
    `${COLOR.RED}【环境校验失败】package.json 中未配置 engines.pnpm 字段，请补充！${COLOR.RESET}`,
  );
  process.exit(1);
}

// ===================== 核心步骤3：Node版本校验 =====================
const currentNodeVersion = process.version;
const isNodeValid = semver.satisfies(currentNodeVersion, engines.node);

if (!isNodeValid) {
  console.error(
    `${COLOR.RED}==================== Node 版本校验失败 ====================${COLOR.RESET}`,
  );
  console.error(`${COLOR.YELLOW}当前版本：${COLOR.RESET} ${currentNodeVersion}`);
  console.error(`${COLOR.YELLOW}要求版本：${COLOR.RESET} ${engines.node}`);
  console.error(`${COLOR.GREEN}解决方案：${COLOR.RESET}`);
  console.error(
    `  1. 若未安装nvm：执行 curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash 安装`,
  );
  console.error(`  2. 执行 nvm install && nvm use 一键切换到项目指定版本`);
  console.error(
    `${COLOR.RED}===========================================================${COLOR.RESET}\n`,
  );
  process.exit(1);
}

// ===================== 核心步骤4：pnpm版本校验 =====================
// 从环境变量获取当前pnpm版本，兼容所有pnpm版本
const currentPnpmVersion = process.env.npm_config_user_agent?.split('pnpm/')[1]?.split(' ')[0];
// 从packageManager解析项目要求的pnpm版本（如pnpm@10.28.2 → 10.28.2）
const requiredPnpmVersion = packageManager?.split('pnpm@')[1] || engines.pnpm;

if (!currentPnpmVersion) {
  console.error(`${COLOR.RED}【环境校验失败】未检测到pnpm环境，请先安装！${COLOR.RESET}`);
  console.error(
    `${COLOR.GREEN}安装命令：${COLOR.RESET} npm install -g pnpm@${requiredPnpmVersion} --location=global\n`,
  );
  process.exit(1);
}

const isPnpmValid = semver.satisfies(currentPnpmVersion, engines.pnpm);
if (!isPnpmValid) {
  console.error(
    `${COLOR.RED}==================== pnpm 版本校验失败 ====================${COLOR.RESET}`,
  );
  console.error(`${COLOR.YELLOW}当前版本：${COLOR.RESET} ${currentPnpmVersion}`);
  console.error(
    `${COLOR.YELLOW}要求版本：${COLOR.RESET} ${engines.pnpm}（项目固定：${requiredPnpmVersion}）`,
  );
  console.error(
    `${COLOR.GREEN}解决方案：${COLOR.RESET} 执行 pnpm add -g pnpm@${requiredPnpmVersion} 一键升级\n`,
  );
  process.exit(1);
}

console.log(`${COLOR.YELLOW}Node 版本：${COLOR.RESET} ${currentNodeVersion}`);
console.log(`${COLOR.YELLOW}pnpm 版本：${COLOR.RESET} ${currentPnpmVersion}`);
process.exit(0);
