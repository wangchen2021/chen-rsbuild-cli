import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import download from 'download-git-repo';
import ora from 'ora';
import chalk from 'chalk';
import { CLI_CONFIG } from '../config';
import { ensureDir } from './path';
export const getTemplateDir = async () => {
    const { localTemplateDir, remoteTemplateRepo } = CLI_CONFIG;
    if (fs.existsSync(localTemplateDir)) {
        return localTemplateDir;
    }
    const spinner = ora(chalk.blue('📥 本地模板不存在，正在拉取远程模板...')).start();
    try {
        const tempDir = path.resolve(os.tmpdir(), `chen-rsbuild-template-${Date.now()}`);
        ensureDir(tempDir);
        await new Promise((resolve, reject) => {
            download(remoteTemplateRepo, tempDir, { clone: true }, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        spinner.succeed(chalk.green('✅ 远程模板拉取成功！'));
        return tempDir;
    }
    catch (err) {
        spinner.fail(chalk.red(`❌ 远程模板拉取失败：${err.message}`));
        throw err;
    }
};
export const renderTemplate = async (templateDir, targetDir, options) => {
    await fs.copy(templateDir, targetDir);
    const packageJsonPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = await fs.readJSON(packageJsonPath);
        packageJson.name = options.projectName;
        packageJson.author = options.author;
        packageJson.description = options.projectDesc;
        await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    }
    const readmePath = path.join(targetDir, 'README.md');
    if (fs.existsSync(readmePath)) {
        let readmeContent = await fs.readFile(readmePath, 'utf8');
        readmeContent = readmeContent
            .replace(/<%= projectName %>/g, options.projectName)
            .replace(/<%= author %>/g, options.author);
        await fs.writeFile(readmePath, readmeContent);
    }
};
