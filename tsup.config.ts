import { defineConfig, type Options } from 'tsup';
import { dependencies, devDependencies } from './package.json';
import builtinModules from 'module';
import packageJson from './package.json';

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

    // 输出格式：CJS（最大兼容性）
    format: ['cjs'],

    // 目标环境：Node24+（LTS 版本）
    target: 'node24',

    // 输出目录
    outDir: 'dist',

    // 清理输出目录（生产模式）
    clean: !options.watch,

    // 源码映射：开发内联，生产隐藏
    sourcemap: options.watch ? 'inline' : undefined,

    // 压缩：生产模式用 terser（兼容 CJS），开发模式关闭
    minify: options.watch ? false : 'terser',

    // 生成类型声明（企业级可维护性）
    dts: {
      entry: 'src/index.ts',
      resolve: true,
    },

    // 外部依赖（不打包，避免兼容性问题）
    external: externalDependencies,
    noExternal: [],

    // 平台：Node.js
    platform: 'node',

    // 禁用代码分割（CJS 无需）
    splitting: false,

    // 保留函数/类名（调试友好）
    keepNames: true,

    // 输出后缀：CJS 用 .cjs 避免解析冲突
    outExtension: (ctx) => ({
      js: ctx.format === 'cjs' ? '.cjs' : '.js',
    }),

    // Tree-shaking 增强
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
    },

    // ESBuild 自定义配置
    esbuildOptions: (opts) => {
      opts.banner = {
        js: `
          // CLI 版本：${packageJson.version}
          // 构建时间：${new Date().toISOString()}
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
