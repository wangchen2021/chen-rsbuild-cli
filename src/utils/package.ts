/** 企业级：包名校验/格式化工具 */
import { UserAnswers } from '../types';

// npm 官方包名正则
const NPM_NAME_REGEX =
  /^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/;

/** 格式化包名（企业级规则） */
export const formatPackageName = (rawName: string): string => {
  let name = rawName
    .toLowerCase()
    .replace(/[\s\u4e00-\u9fa5!@#$%^&*()+=<>?/\\|{}[\]`~:;"]+/g, '-') // 替换非法字符
    .replace(/-+/g, '-') // 去重连字符
    .replace(/^[-./]+|[-./]+$/g, ''); // 去首尾特殊字符

  // 兜底：空名称/纯特殊字符 → 默认名
  if (!name) {
    name = 'react-rsbuild-app';
  }

  return name;
};

/** 校验包名合法性 */
export const validatePackageName = (input: string): boolean | string => {
  const formatted = formatPackageName(input);
  if (NPM_NAME_REGEX.test(formatted)) {
    return true;
  }
  return '包名不符合npm规范！仅允许小写字母、数字、-/_/./~，且不能有空格/中文';
};

/** 整合用户输入（企业级：参数校验） */
export const mergeUserOptions = (
  rawProjectName: string,
  answers: UserAnswers,
): { projectName: string; author: string; projectDesc: string } => {
  const projectName = formatPackageName(answers.packageName || rawProjectName);
  return {
    projectName,
    author: answers.author || '',
    projectDesc: answers.projectDesc || '基于 React+RSBuild+TS 的企业级项目',
  };
};
