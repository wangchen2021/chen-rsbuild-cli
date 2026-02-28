const NPM_NAME_REGEX = /^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/;
export const formatPackageName = (rawName) => {
    let name = rawName
        .toLowerCase()
        .replace(/[\s\u4e00-\u9fa5!@#$%^&*()+=<>?/\\|{}[\]`~:;"]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^[-./]+|[-./]+$/g, '');
    if (!name) {
        name = 'react-rsbuild-app';
    }
    return name;
};
export const validatePackageName = (input) => {
    const formatted = formatPackageName(input);
    if (NPM_NAME_REGEX.test(formatted)) {
        return true;
    }
    return '包名不符合npm规范！仅允许小写字母、数字、-/_/./~，且不能有空格/中文';
};
export const mergeUserOptions = (rawProjectName, answers) => {
    const projectName = formatPackageName(answers.packageName || rawProjectName);
    return {
        projectName,
        author: answers.author || '',
        projectDesc: answers.projectDesc || '基于 React+RSBuild+TS 的企业级项目',
    };
};
