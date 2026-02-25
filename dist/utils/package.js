"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeUserOptions = exports.validatePackageName = exports.formatPackageName = void 0;
const NPM_NAME_REGEX = /^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/;
const formatPackageName = (rawName) => {
    let name = rawName.toLowerCase()
        .replace(/[\s\u4e00-\u9fa5!@#$%^&*()+=<>?/\\|{}[\]`~:;"]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^[-./]+|[-./]+$/g, '');
    if (!name) {
        name = 'react-rsbuild-app';
    }
    return name;
};
exports.formatPackageName = formatPackageName;
const validatePackageName = (input) => {
    const formatted = (0, exports.formatPackageName)(input);
    if (NPM_NAME_REGEX.test(formatted)) {
        return true;
    }
    return '包名不符合npm规范！仅允许小写字母、数字、-/_/./~，且不能有空格/中文';
};
exports.validatePackageName = validatePackageName;
const mergeUserOptions = (rawProjectName, answers) => {
    const projectName = (0, exports.formatPackageName)(answers.packageName || rawProjectName);
    return {
        projectName,
        author: answers.author || '',
        projectDesc: answers.projectDesc || '基于 React+RSBuild+TS 的企业级项目',
    };
};
exports.mergeUserOptions = mergeUserOptions;
