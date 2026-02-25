/**
 * 自定义 download-git-repo 类型声明（解决 TS 找不到声明的问题）
 * 企业级做法：补全核心类型，兼顾类型提示和编译通过
 */
declare module 'download-git-repo' {
  interface DownloadOptions {
    /** 是否克隆（true 用 git clone，false 下载 zip） */
    clone?: boolean;
    /** 分支/标签 */
    checkout?: string;
  }

  /**
   * 下载 git 仓库模板
   * @param repo 仓库地址（如 github:owner/name、gitlab:owner/name、git@xxx.com:owner/name）
   * @param dest 目标目录
   * @param options 配置项
   * @param callback 回调函数
   */
  type DownloadGitRepo = (
    repo: string,
    dest: string,
    options?: DownloadOptions,
    callback?: (err: Error | null) => void
  ) => void;

  const download: DownloadGitRepo;
  export default download;
}