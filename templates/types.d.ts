declare type EnvConfigType = typeof ENV_CONFIG;
declare interface GitInfo {
  commitHash: string;
  imageTag: string;
  branch: string;
}

declare const ENV_CONFIG: {
  MODE: 'development' | 'production' | 'unknown';
  CDN: string;
  BUILD_TIME: string;
  API_URL: string;
  GIT_INFO: {
    commitHash: string;
    imageTag: string;
    branch: string;
  };
};
