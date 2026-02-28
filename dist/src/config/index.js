import { getCliRootDir } from '../utils/path';
export const CLI_CONFIG = {
    name: 'chen-rsbuild-cli',
    version: '1.0.0',
    localTemplateDir: `${getCliRootDir()}/templates`,
    remoteTemplateRepo: 'git@github.com:your-org/react-rsbuild-template.git',
    templateVersion: 'v1.0.0',
};
