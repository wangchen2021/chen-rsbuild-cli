#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const config_1 = require("./config");
const package_1 = require("./utils/package");
const template_1 = require("./utils/template");
commander_1.program
    .name(config_1.CLI_CONFIG.name)
    .version(config_1.CLI_CONFIG.version, '-v, --version', '查看 CLI 版本')
    .description('企业级 React+RSBuild+TS 项目脚手架')
    .helpOption('-h, --help', '查看帮助');
commander_1.program
    .command('create <project-name>')
    .description('创建 React+RSBuild+TS 项目')
    .action(async (rawProjectName) => {
    try {
        const defaultPackageName = (0, package_1.formatPackageName)(rawProjectName);
        const answers = await inquirer_1.default.prompt([
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
                validate: package_1.validatePackageName,
            },
        ]);
        const options = (0, package_1.mergeUserOptions)(rawProjectName, answers);
        const targetDir = path_1.default.resolve(process.cwd(), options.projectName);
        if (fs_extra_1.default.existsSync(targetDir)) {
            console.log(chalk_1.default.red(`❌ 错误：目录 ${options.projectName} 已存在！`));
            process.exit(1);
        }
        const spinner = (0, ora_1.default)(chalk_1.default.blue(`🚀 正在初始化项目 ${options.projectName}...`)).start();
        const templateDir = await (0, template_1.getTemplateDir)();
        spinner.info(chalk_1.default.gray(`📁 使用模板目录：${templateDir}`));
        await fs_extra_1.default.ensureDir(targetDir);
        await (0, template_1.renderTemplate)(templateDir, targetDir, options);
        spinner.succeed(chalk_1.default.green(`✅ 项目 ${options.projectName} 创建成功！`));
        console.log('\n' + chalk_1.default.cyan('📝 下一步操作：'));
        console.log(chalk_1.default.gray(`  cd ${options.projectName}`));
        console.log(chalk_1.default.gray('  pnpm install'));
        console.log(chalk_1.default.gray('  pnpm run dev'));
    }
    catch (error) {
        const err = error;
        console.log(chalk_1.default.red(`❌ 项目创建失败：${err.message}`));
        process.exit(1);
    }
});
commander_1.program.parse(process.argv);
if (!process.argv.slice(2).length) {
    commander_1.program.outputHelp();
}
