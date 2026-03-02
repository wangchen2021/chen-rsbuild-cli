/** 企业级：模板管理（本地+远程降级） */
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';
import { CLI_CONFIG } from '../config';
import { ensureDir } from './path';
import { TemplateOptions } from '../types';

/** 获取模板目录（本地不存在则拉取远程） */
export const getTemplateDir = async (): Promise<string> => {
  const { localTemplateDir, remoteTemplateRepo } = CLI_CONFIG;

  // 1. 本地模板存在 → 直接返回
  if (fs.existsSync(localTemplateDir)) {
    return localTemplateDir;
  }

  // 2. 本地不存在 → 拉取远程模板（企业级核心逻辑）
  const spinner = ora(chalk.blue('📥 本地模板不存在，正在拉取远程模板...')).start();
  try {
    const tempDir = path.resolve(os.tmpdir(), `chen-rsbuild-template-${Date.now()}`);
    ensureDir(tempDir);

    // 拉取远程 git 仓库模板
    await new Promise<void>((resolve, reject) => {
      download(remoteTemplateRepo, tempDir, { clone: true }, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });

    spinner.succeed(chalk.green('✅ 远程模板拉取成功！'));
    return tempDir;
  } catch (err) {
    spinner.fail(chalk.red(`❌ 远程模板拉取失败：${(err as Error).message}`));
    throw err;
  }
};

/** 根据功能选择清理不需要的文件 */
const cleanupUnselectedFeatures = async (
  targetDir: string,
  features: TemplateOptions['features'],
): Promise<void> => {
  // 如果不集成 Husky，删除相关文件和配置
  // 注意：commitlint 和 lint-staged 依赖于 husky，所以一起删除
  if (!features.husky) {
    const huskyDir = path.join(targetDir, '.husky');
    const commitlintConfig = path.join(targetDir, 'commitlint.config.ts');

    if (fs.existsSync(huskyDir)) {
      await fs.remove(huskyDir);
    }
    if (fs.existsSync(commitlintConfig)) {
      await fs.remove(commitlintConfig);
    }
  }

  // 如果不集成 Storybook，删除相关文件和配置
  if (!features.storybook) {
    const storybookDir = path.join(targetDir, '.storybook');

    if (fs.existsSync(storybookDir)) {
      await fs.remove(storybookDir);
    }
  }
};

/** 根据功能选择更新 package.json */
const updatePackageJson = async (targetDir: string, options: TemplateOptions): Promise<void> => {
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) return;

  const packageJson = await fs.readJSON(packageJsonPath);

  // 更新核心字段
  packageJson.name = options.projectName;
  packageJson.author = options.author;
  packageJson.description = options.projectDesc;

  // 根据功能选择更新 scripts
  if (!options.features.husky) {
    // 删除 husky 相关的 scripts
    delete packageJson.scripts.prepare;
    delete packageJson.scripts['git:commit'];

    // 删除 lint-staged 配置
    delete packageJson['lint-staged'];

    // 删除 commitizen 配置
    if (packageJson.config && packageJson.config.commitizen) {
      delete packageJson.config.commitizen;
    }
  }

  if (!options.features.storybook) {
    delete packageJson.scripts.storybook;
    delete packageJson.scripts['build-storybook'];
  }

  // 根据功能选择更新 devDependencies
  if (!options.features.husky) {
    // husky 相关的依赖（包括 commitlint 和 lint-staged）
    const huskyDeps = [
      '@commitlint/cli',
      '@commitlint/config-angular',
      '@commitlint/format',
      '@commitlint/types',
      'commitizen',
      'cz-conventional-changelog',
      'husky',
      'lint-staged',
    ];
    huskyDeps.forEach((dep) => {
      delete packageJson.devDependencies[dep];
    });
  }

  if (!options.features.storybook) {
    const storybookDeps = [
      '@storybook/addon-a11y',
      '@storybook/addon-docs',
      '@storybook/addon-links',
      '@storybook/addon-onboarding',
      '@storybook/react',
      '@storybook/react-docgen-typescript-plugin',
      'eslint-plugin-storybook',
      'puppeteer',
      'storybook',
      'storybook-react-rsbuild',
    ];
    storybookDeps.forEach((dep) => {
      delete packageJson.devDependencies[dep];
    });
  }

  await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
};

/** 渲染模板变量（企业级：兼容所有模板文件） */
export const renderTemplate = async (
  templateDir: string,
  targetDir: string,
  options: TemplateOptions,
): Promise<void> => {
  // 复制模板文件到目标目录
  await fs.copy(templateDir, targetDir);

  // 根据功能选择清理文件
  await cleanupUnselectedFeatures(targetDir, options.features);

  // 更新 package.json
  await updatePackageJson(targetDir, options);

  // 企业级扩展：渲染其他模板文件（如 .env、README.md）
  const readmePath = path.join(targetDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    let readmeContent = await fs.readFile(readmePath, 'utf8');
    readmeContent = readmeContent
      .replace(/<%= projectName %>/g, options.projectName)
      .replace(/<%= author %>/g, options.author);
    await fs.writeFile(readmePath, readmeContent);
  }
};
