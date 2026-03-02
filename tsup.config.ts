import { defineConfig, type Options } from 'tsup';

/**
 * 企业级 CLI 构建配置
 * 特点：
 * 1. 双格式输出（ESM + CJS）确保最大兼容性
 * 2. 目标环境适配 Node.js 24+（企业常用基线）
 * 3. 完整的类型声明生成
 * 4. 代码压缩和优化
 * 5. 清晰的源码映射
 */
export default defineConfig((options) => {
  // 基础配置
  const baseConfig: Options = {
    // 入口文件
    entry: ['src/index.ts'],

    // 输出格式：ESM + CJS 双格式
    format: ['esm', 'cjs'],

    target: 'node24',

    // 输出目录
    outDir: 'dist',

    // 清理输出目录
    clean: true,

    // 生成源码映射（生产环境可关闭）
    sourcemap: true,

    // 代码压缩
    minify: true,

    // 生成类型声明文件
    dts: true,

    // 将依赖外部化（不打包到bundle中）
    external: [
      'fs',
      'path',
      'os',
      'child_process',
      'util',
      'stream',
      'events',
      'crypto',
      'zlib',
      'http',
      'https',
      'net',
      'tls',
      'dns',
      'url',
      // 第三方依赖
      'commander',
      'inquirer',
      'chalk',
      'ora',
      'fs-extra',
      'download-git-repo',
      'ejs',
    ],

    // 不打包 node_modules 中的依赖
    noExternal: [],

    // 替换环境变量
    // define: {
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    // },

    // 平台：Node.js
    platform: 'node',

    // 保持模块结构
    splitting: false,

    // 保持目录结构
    keepNames: true,

    // 输出文件命名规则
    outExtension: ({ format }) => ({
      js: format === 'cjs' ? '.cjs' : '.js',
    }),
  };

  // 开发模式配置
  if (options.watch) {
    return {
      ...baseConfig,
      minify: false,
      sourcemap: 'inline',
      clean: false,
    };
  }

  // 生产模式配置
  return baseConfig;
});
