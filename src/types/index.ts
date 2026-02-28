/** 企业级：统一类型声明 */
export interface UserAnswers {
  projectDesc: string;
  author: string;
  packageName?: string;
}

export interface CliConfig {
  name: string;
  version: string;
  localTemplateDir: string;
  remoteTemplateRepo: string; // 企业级：远程模板仓库（可配置）
  templateVersion: string;
}

export interface TemplateOptions {
  projectName: string;
  author: string;
  projectDesc: string;
}
