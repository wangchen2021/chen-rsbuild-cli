import dayjs from 'dayjs';
import * as git from 'git-rev-sync';

export const env = process.env.NODE_ENV;
export const isDevelopment = env === 'development';
export const isProduction = env === 'production';
export const ENV_CONFIG: EnvConfigType = isDevelopment
  ? {
      MODE: 'development',
      CDN: 'https://cdn.duguqinchen.com/common',
      API_URL: 'http://localhost:3000',
      BUILD_TIME: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      GIT_INFO: {
        commitHash: git.short(),
        imageTag: git.tag(),
        branch: git.branch(),
      },
    }
  : isProduction
    ? {
        MODE: 'production',
        CDN: 'https://cdn.duguqinchen.com/common',
        API_URL: 'https://nestjs.duguqinchen.com/proApi',
        BUILD_TIME: import.meta.env.BUILD_TIME || dayjs().format('YYYY-MM-DD HH:mm:ss'),
        GIT_INFO: {
          commitHash: import.meta.env.GIT_COMMIT_HASH || 'unknown',
          imageTag: import.meta.env.GIT_TAG || 'unknown',
          branch: import.meta.env.GIT_BRANCH || 'unknown',
        },
      }
    : {
        MODE: 'unknown',
        CDN: 'https://cdn.duguqinchen.com/common',
        API_URL: 'http://localhost:3000',
        BUILD_TIME: import.meta.env.BUILD_TIME || dayjs().format('YYYY-MM-DD HH:mm:ss'),
        GIT_INFO: {
          commitHash: git.short(),
          imageTag: git.tag(),
          branch: git.branch(),
        },
      };
