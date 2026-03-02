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
        {
          type: 'checkbox',
          name: 'features',
          message: '请选择要集成的功能:',
          choices: [
            {
              name: 'Husky (Git hooks 管理 + commitlint + lint-staged)',
              value: 'husky',
              checked: true,
            },
            {
              name: 'Storybook (组件文档 + 可视化测试)',
              value: 'storybook',
              checked: true,
            },
            {
              name: 'React Router (路由管理)',
              value: 'reactRouter',
              checked: true,
            },
            {
              name: 'Release-it (自动化版本发布)',
              value: 'releaseIt',
              checked: true,
            },
            {
              name: 'GitHub Actions (CI/CD 自动化)',
              value: 'gitAction',
              checked: true,
            },
          ],
        },
      ]);

      // 2. 整合并格式化用户输入
      const selectedFeatures = {
        husky: answers.features.includes('husky'),
        storybook: answers.features.includes('storybook'),
        reactRouter: answers.features.includes('reactRouter'),
        releaseIt: answers.features.includes('releaseIt'),
        gitAction: answers.features.includes('gitAction'),
      };

      const options = mergeUserOptions(rawProjectName, {
        ...answers,
        features: selectedFeatures,
      });

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

      // 7. 成功提示（企业级：结构化展示 + 清晰的下一步指引）
      spinner.succeed(chalk.green(`✅ 项目 ${options.projectName} 创建成功！`));

      // 结构化展示生成结果
      console.log('\n' + chalk.bold.cyan('📊 项目生成结果'));
      console.log(chalk.gray('═'.repeat(50)));

      // 项目基本信息
      console.log(chalk.bold('📝 项目信息：'));
      console.log(chalk.gray(`  ├─ 项目名称：${chalk.white(options.projectName)}`));
      console.log(chalk.gray(`  ├─ 项目描述：${chalk.white(options.projectDesc)}`));
      console.log(chalk.gray(`  ├─ 作者名称：${chalk.white(options.author || '未设置')}`));
      console.log(chalk.gray(`  └─ 项目目录：${chalk.white(targetDir)}`));

      // 已集成的功能模块
      console.log('\n' + chalk.bold('🔧 已集成的功能模块：'));

      const featureStatus = [
        {
          name: 'Husky (Git hooks 管理 + commitlint + lint-staged)',
          enabled: options.features.husky,
        },
        { name: 'Storybook (组件文档 + 可视化测试)', enabled: options.features.storybook },
        { name: 'React Router (路由管理)', enabled: options.features.reactRouter },
        { name: 'Release-it (自动化版本发布)', enabled: options.features.releaseIt },
        { name: 'GitHub Actions (CI/CD 自动化)', enabled: options.features.gitAction },
      ];

      featureStatus.forEach((feature, index) => {
        const prefix = index === featureStatus.length - 1 ? '  └─ ' : '  ├─ ';
        const status = feature.enabled ? chalk.green('✓ 已集成') : chalk.gray('✗ 未集成');
        console.log(chalk.gray(`${prefix}${feature.name}: ${status}`));
      });

      // 项目结构概览
      console.log('\n' + chalk.bold('📁 项目结构概览：'));
      try {
        const files = await fs.readdir(targetDir);
        const displayFiles = files.filter(
          (file) => !file.startsWith('.') && file !== 'node_modules',
        );

        displayFiles.forEach((file, index) => {
          const prefix = index === displayFiles.length - 1 ? '  └─ ' : '  ├─ ';
          const isDir = fs.statSync(path.join(targetDir, file)).isDirectory();
          const icon = isDir ? '📁' : '📄';
          console.log(chalk.gray(`${prefix}${icon} ${file}`));
        });

        // 如果有src目录，显示其内容
        const srcDir = path.join(targetDir, 'src');
        if (fs.existsSync(srcDir)) {
          const srcFiles = await fs.readdir(srcDir);
          console.log(chalk.gray('      └─ 📁 src/'));
          srcFiles.forEach((file, index) => {
            const prefix = index === srcFiles.length - 1 ? '          └─ ' : '          ├─ ';
            const isDir = fs.statSync(path.join(srcDir, file)).isDirectory();
            const icon = isDir ? '📁' : '📄';
            console.log(chalk.gray(`${prefix}${icon} ${file}`));
          });
        }
      } catch (error) {
        // 静默处理文件读取错误
      }

      // 快速开始指南
      console.log('\n' + chalk.bold.cyan('🚀 快速开始指南'));
      console.log(chalk.gray('═'.repeat(50)));

      console.log(chalk.bold('1. 进入项目目录：'));
      console.log(chalk.gray(`   cd ${options.projectName}`));

      console.log(chalk.bold('\n2. 安装依赖：'));
      console.log(chalk.gray('   pnpm install'));

      console.log(chalk.bold('\n3. 启动开发服务器：'));
      console.log(chalk.gray('   pnpm run dev'));

      // 根据集成的功能提供额外指引
      console.log(chalk.bold('\n4. 其他可用命令：'));

      const availableCommands = [
        { cmd: 'pnpm run build', desc: '构建生产版本' },
        { cmd: 'pnpm run preview', desc: '预览生产构建' },
        { cmd: 'pnpm run lint', desc: '代码检查' },
        { cmd: 'pnpm run format', desc: '代码格式化' },
      ];

      if (options.features.storybook) {
        availableCommands.push(
          { cmd: 'pnpm run storybook', desc: '启动 Storybook' },
          { cmd: 'pnpm run build-storybook', desc: '构建 Storybook' },
        );
      }

      if (options.features.husky) {
        availableCommands.push({ cmd: 'pnpm run git:commit', desc: '提交代码（使用 commitizen）' });
      }

      if (options.features.releaseIt) {
        availableCommands.push(
          { cmd: 'pnpm run release', desc: '发布新版本' },
          { cmd: 'pnpm run release:patch', desc: '发布补丁版本' },
          { cmd: 'pnpm run release:minor', desc: '发布次要版本' },
          { cmd: 'pnpm run release:major', desc: '发布主要版本' },
        );
      }

      availableCommands.forEach((cmd, index) => {
        const prefix = index === availableCommands.length - 1 ? '   └─ ' : '   ├─ ';
        console.log(chalk.gray(`${prefix}${chalk.cyan(cmd.cmd)} - ${cmd.desc}`));
      });

      // 温馨提示
      console.log('\n' + chalk.bold.yellow('💡 温馨提示：'));
      console.log(chalk.gray('   • 首次运行前请确保已安装 pnpm'));
      console.log(chalk.gray('   • 如需使用 GitHub Actions，请配置相应的 Secrets'));
      console.log(chalk.gray('   • 项目已包含完整的 TypeScript 配置和代码规范'));

      console.log('\n' + chalk.green.bold('🎉 开始你的 React 开发之旅吧！'));
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
