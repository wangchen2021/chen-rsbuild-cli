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

/** 渲染模板变量（企业级：兼容所有模板文件） */
export const renderTemplate = async (
  templateDir: string,
  targetDir: string,
  options: TemplateOptions,
): Promise<void> => {
  // 复制模板文件到目标目录
  await fs.copy(templateDir, targetDir);

  // 渲染 package.json（核心）
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = await fs.readJSON(packageJsonPath);
    // 覆盖核心字段（企业级：避免 ejs 渲染遗漏）
    packageJson.name = options.projectName;
    packageJson.author = options.author;
    packageJson.description = options.projectDesc;
    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
  }

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
