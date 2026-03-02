import { defineConfig, type Options } from 'tsup';
import { dependencies, devDependencies, version } from './package.json';
import builtinModules from 'module';
import dayjs from 'dayjs';

/**
 * 企业级 CLI 构建配置
 * 目标：稳定、可靠、兼容性好、易维护
 */
export default defineConfig((options) => {
  // 自动生成外部依赖列表（内置模块 + 第三方依赖）
  const externalDependencies = [
    ...builtinModules.builtinModules,
    ...Object.keys(dependencies || {}),
    ...Object.keys(devDependencies || {}).filter((name) => !name.startsWith('@types/')),
  ];

  // 基础配置
  const baseConfig: Options = {
    // 多入口支持（主入口 + 未来扩展）
    entry: {
      index: 'src/index.ts',
    },

    // 输出格式：只使用 CJS 确保最大兼容性
    format: ['esm'],

    target: 'node24',

    // 输出目录
    outDir: 'dist',

    // 清理输出目录
    clean: !options.watch,

    // 源码映射：关闭以减小文件大小
    sourcemap: false,

    // 压缩：关闭以避免兼容性问题
    minify: false,

    // 生成类型声明
    dts: false,
    // 外部依赖（不打包，避免兼容性问题）
    external: externalDependencies,
    // 平台：Node.js
    platform: 'node',

    // 禁用代码分割
    splitting: false,

    // 保留函数/类名（调试友好）
    keepNames: true,

    // 输出文件扩展名
    outExtension: () => ({
      js: '.js',
    }),

    // 不进行 tree shaking（保持代码完整性）
    treeshake: false,

    // 不打包 node_modules
    noExternal: [],

    // 不进行代码优化
    minifyWhitespace: false,
    minifyIdentifiers: false,
    minifySyntax: false,

    // ESBuild 自定义配置
    esbuildOptions: (opts) => {
      opts.banner = {
        js: `
          // CLI 版本：${version}
          // 构建时间：${dayjs().format('YYYY-MM-DD HH:mm:ss')}
          "use strict";
        `.trim(),
      };
      opts.resolveExtensions = ['.ts', '.js', '.json'];
      opts.logOverride = {
        'empty-import-meta': 'silent',
        'unsupported-feature': 'error',
      };
    },

    // 日志配置
    silent: !options.watch,
  };

  return baseConfig;
});
