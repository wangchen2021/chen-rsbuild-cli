/** 企业级：CLI 配置中心化管理 */
import { CliConfig } from '../types';
import { getCliRootDir } from '../utils/path';

// 企业级配置（可扩展多环境、多模板）
export const CLI_CONFIG: CliConfig = {
  name: 'chen-rsbuild-cli',
  version: '1.0.0',
  localTemplateDir: `${getCliRootDir()}/templates`, // 动态拼接模板路径
  remoteTemplateRepo: 'git@github.com:your-org/react-rsbuild-template.git', // 替换为你的远程仓库
  templateVersion: 'v1.0.0',
};
