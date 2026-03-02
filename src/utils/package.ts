/** 企业级：包名处理工具 */
import { UserAnswers, TemplateOptions } from '../types';

/** 格式化包名（符合 npm 规范） */
export const formatPackageName = (rawName: string): string => {
  return rawName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
};

/** 校验包名（企业级：实时反馈） */
export const validatePackageName = (input: string): boolean | string => {
  if (!input) return '包名不能为空';
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(input)) {
    return '包名必须符合 npm 规范：小写字母、数字、连字符，不能以连字符开头或结尾';
  }
  return true;
};

/** 整合用户选项（企业级：数据清洗） */
export const mergeUserOptions = (
  rawProjectName: string,
  answers: Omit<UserAnswers, 'features'> & { features: { husky: boolean; storybook: boolean } },
): TemplateOptions => {
  return {
    projectName: rawProjectName,
    author: answers.author || '',
    projectDesc: answers.projectDesc || '基于 React+RSBuild+TS 的企业级项目',
    features: {
      husky: answers.features.husky,
      storybook: answers.features.storybook,
    },
  };
};
