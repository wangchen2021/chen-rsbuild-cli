#!/usr/bin/env node
import path from 'path';
import fs from 'fs-extra';
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { CLI_CONFIG } from './config';
import { formatPackageName, validatePackageName, mergeUserOptions } from './utils/package';
import { getTemplateDir, renderTemplate } from './utils/template';
program
    .name(CLI_CONFIG.name)
    .version(CLI_CONFIG.version, '-v, --version', '查看 CLI 版本')
    .description('企业级 React+RSBuild+TS 项目脚手架')
    .helpOption('-h, --help', '查看帮助');
program
    .command('create <project-name>')
    .description('创建 React+RSBuild+TS 项目')
    .action(async (rawProjectName) => {
    try {
        const defaultPackageName = formatPackageName(rawProjectName);
        const answers = await inquirer.prompt([
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
                validate: validatePackageName,
            },
        ]);
        const options = mergeUserOptions(rawProjectName, answers);
        const targetDir = path.resolve(process.cwd(), options.projectName);
        if (fs.existsSync(targetDir)) {
            console.log(chalk.red(`❌ 错误：目录 ${options.projectName} 已存在！`));
            process.exit(1);
        }
        const spinner = ora(chalk.blue(`🚀 正在初始化项目 ${options.projectName}...`)).start();
        const templateDir = await getTemplateDir();
        spinner.info(chalk.gray(`📁 使用模板目录：${templateDir}`));
        await fs.ensureDir(targetDir);
        await renderTemplate(templateDir, targetDir, options);
        spinner.succeed(chalk.green(`✅ 项目 ${options.projectName} 创建成功！`));
        console.log('\n' + chalk.cyan('📝 下一步操作：'));
        console.log(chalk.gray(`  cd ${options.projectName}`));
        console.log(chalk.gray('  pnpm install'));
        console.log(chalk.gray('  pnpm run dev'));
    }
    catch (error) {
        const err = error;
        console.log(chalk.red(`❌ 项目创建失败：${err.message}`));
        process.exit(1);
    }
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
