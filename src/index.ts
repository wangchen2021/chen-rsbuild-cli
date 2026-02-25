#!/usr/bin/env node
/** 企业级 CLI 入口（核心逻辑） */
import path from 'path';
import fs from 'fs-extra';
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { UserAnswers } from './types';
import { CLI_CONFIG } from './config';
import { getCliRootDir } from './utils/path';
import { formatPackageName, validatePackageName, mergeUserOptions } from './utils/package';
import { getTemplateDir, renderTemplate } from './utils/template';

// 初始化 CLI 配置
program
  .name(CLI_CONFIG.name)
  .version(CLI_CONFIG.version, '-v, --version', '查看 CLI 版本')
  .description('企业级 React+RSBuild+TS 项目脚手架')
  .helpOption('-h, --help', '查看帮助');

// 创建项目命令（企业级：参数校验+容错）
program
  .command('create <project-name>')
  .description('创建 React+RSBuild+TS 项目')
  .action(async (rawProjectName: string) => {
    try {
      // 1. 交互式询问用户信息（企业级：分步校验）
      const defaultPackageName = formatPackageName(rawProjectName);
      const answers: UserAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectDesc',
          message: '请输入项目描述:',
          default: '基于 React+RSBuild+TS 的企业级项目',
        },
        {
          type: 'input',
          name: 'author',
          message: '请输入作者名称:',
          default: '',
        },
        {
          type: 'input',
          name: 'packageName',
          message: '请确认/修改项目包名（符合npm规范）:',
          default: defaultPackageName,
          validate: validatePackageName, // 实时校验
        },
      ]);

      // 2. 整合并格式化用户输入
      const options = mergeUserOptions(rawProjectName, answers);
      const targetDir = path.resolve(process.cwd(), options.projectName);

      // 3. 检查目标目录是否存在（企业级：容错提示）
      if (fs.existsSync(targetDir)) {
        console.log(chalk.red(`❌ 错误：目录 ${options.projectName} 已存在！`));
        process.exit(1);
      }

      // 4. 初始化项目（企业级：加载动画+进度提示）
      const spinner = ora(chalk.blue(`🚀 正在初始化项目 ${options.projectName}...`)).start();

      // 5. 获取模板目录（本地/远程降级）
      const templateDir = await getTemplateDir();
      spinner.info(chalk.gray(`📁 使用模板目录：${templateDir}`));

      // 6. 创建目标目录并渲染模板
      await fs.ensureDir(targetDir);
      await renderTemplate(templateDir, targetDir, options);

      // 7. 成功提示（企业级：清晰的下一步指引）
      spinner.succeed(chalk.green(`✅ 项目 ${options.projectName} 创建成功！`));
      console.log('\n' + chalk.cyan('📝 下一步操作：'));
      console.log(chalk.gray(`  cd ${options.projectName}`));
      console.log(chalk.gray('  pnpm install'));
      console.log(chalk.gray('  pnpm run dev'));

    } catch (error) {
      // 企业级：错误捕获+友好提示
      const err = error as Error;
      console.log(chalk.red(`❌ 项目创建失败：${err.message}`));
      process.exit(1);
    }
  });

// 解析命令行参数（企业级：兜底帮助）
program.parse(process.argv);
if (!process.argv.slice(2).length) {
  program.outputHelp();
}