"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = exports.getTemplateDir = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const download_git_repo_1 = __importDefault(require("download-git-repo"));
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../config");
const path_2 = require("./path");
const getTemplateDir = async () => {
    const { localTemplateDir, remoteTemplateRepo } = config_1.CLI_CONFIG;
    if (fs_extra_1.default.existsSync(localTemplateDir)) {
        return localTemplateDir;
    }
    const spinner = (0, ora_1.default)(chalk_1.default.blue('📥 本地模板不存在，正在拉取远程模板...')).start();
    try {
        const tempDir = path_1.default.resolve(os_1.default.tmpdir(), `chen-rsbuild-template-${Date.now()}`);
        (0, path_2.ensureDir)(tempDir);
        await new Promise((resolve, reject) => {
            (0, download_git_repo_1.default)(remoteTemplateRepo, tempDir, { clone: true }, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        spinner.succeed(chalk_1.default.green('✅ 远程模板拉取成功！'));
        return tempDir;
    }
    catch (err) {
        spinner.fail(chalk_1.default.red(`❌ 远程模板拉取失败：${err.message}`));
        throw new Error('模板获取失败，请检查网络或远程仓库地址');
    }
};
exports.getTemplateDir = getTemplateDir;
const renderTemplate = async (templateDir, targetDir, options) => {
    await fs_extra_1.default.copy(templateDir, targetDir);
    const packageJsonPath = path_1.default.join(targetDir, 'package.json');
    if (fs_extra_1.default.existsSync(packageJsonPath)) {
        const packageJson = await fs_extra_1.default.readJSON(packageJsonPath);
        packageJson.name = options.projectName;
        packageJson.author = options.author;
        packageJson.description = options.projectDesc;
        await fs_extra_1.default.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    }
    const readmePath = path_1.default.join(targetDir, 'README.md');
    if (fs_extra_1.default.existsSync(readmePath)) {
        let readmeContent = await fs_extra_1.default.readFile(readmePath, 'utf8');
        readmeContent = readmeContent
            .replace(/<%= projectName %>/g, options.projectName)
            .replace(/<%= author %>/g, options.author);
        await fs_extra_1.default.writeFile(readmePath, readmeContent);
    }
};
exports.renderTemplate = renderTemplate;
