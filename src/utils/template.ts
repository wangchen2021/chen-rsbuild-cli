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

    // 递归查找并删除所有 .stories 和 .story 文件
    const deleteStoryFiles = async (dir: string): Promise<void> => {
      try {
        const items = await fs.readdir(dir, { withFileTypes: true });

        for (const item of items) {
          const fullPath = path.join(dir, item.name);

          if (item.isDirectory()) {
            // 递归遍历子目录
            await deleteStoryFiles(fullPath);
          } else if (item.isFile()) {
            // 检查是否是 .stories 或 .story 文件
            if (
              item.name.endsWith('.stories.ts') ||
              item.name.endsWith('.stories.tsx') ||
              item.name.endsWith('.stories.js') ||
              item.name.endsWith('.stories.jsx') ||
              item.name.endsWith('.story.ts') ||
              item.name.endsWith('.story.tsx') ||
              item.name.endsWith('.story.js') ||
              item.name.endsWith('.story.jsx')
            ) {
              await fs.remove(fullPath);
            }
          }
        }
      } catch (error) {
        // 静默处理错误，不影响主要功能
      }
    };

    // 从 src 目录开始查找
    const srcDir = path.join(targetDir, 'src');
    if (fs.existsSync(srcDir)) {
      await deleteStoryFiles(srcDir);
    }
  }

  // 如果不集成 React Router，删除相关目录
  if (!features.reactRouter) {
    const routerDir = path.join(targetDir, 'src/router');

    if (fs.existsSync(routerDir)) {
      await fs.remove(routerDir);
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
    // 安全删除 husky 相关的 scripts
    if (packageJson.scripts) {
      delete packageJson.scripts.prepare;
      delete packageJson.scripts['git:commit'];
    }

    // 安全删除 lint-staged 配置
    if (packageJson['lint-staged']) {
      delete packageJson['lint-staged'];
    }

    // 安全删除 commitizen 配置
    if (packageJson.config && packageJson.config.commitizen) {
      delete packageJson.config.commitizen;
      // 如果 config 对象为空，删除整个 config
      if (Object.keys(packageJson.config).length === 0) {
        delete packageJson.config;
      }
    }
  }

  if (!options.features.storybook) {
    // 安全删除 storybook 相关的 scripts
    if (packageJson.scripts) {
      delete packageJson.scripts.storybook;
      delete packageJson.scripts['build-storybook'];
    }
  }

  // 根据功能选择更新 devDependencies
  if (!options.features.husky && packageJson.devDependencies) {
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
      if (packageJson.devDependencies[dep]) {
        delete packageJson.devDependencies[dep];
      }
    });
  }

  if (!options.features.storybook && packageJson.devDependencies) {
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
      if (packageJson.devDependencies[dep]) {
        delete packageJson.devDependencies[dep];
      }
    });
  }

  // 根据功能选择更新 dependencies
  if (!options.features.reactRouter && packageJson.dependencies) {
    // React Router 相关的依赖
    const reactRouterDeps = ['react-router-dom'];
    reactRouterDeps.forEach((dep) => {
      if (packageJson.dependencies[dep]) {
        delete packageJson.dependencies[dep];
      }
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
  // 注意：这里使用简单复制，过滤逻辑可能有问题
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
