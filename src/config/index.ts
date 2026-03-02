/** 企业级：CLI 配置中心化管理 */
import { CliConfig } from '../types';
import { getCliRootDir } from '../utils/path';

// 企业级配置（可扩展多环境、多模板）
export const CLI_CONFIG: CliConfig = {
  name: 'chen-rsbuild-cli',
  version: '1.0.0',
  localTemplateDir: `${getCliRootDir()}/templates`,
  remoteTemplateRepo: 'https://github.com/wangchen2021/chen-rsbuild-cli.git',
  templateVersion: 'v1.0.0',
};
