import { defineConfig } from 'tsup';

export default defineConfig({
  // 入口文件（CLI 主入口）
  entry: ['src/index.ts'],
  // 输出格式：企业级推荐双格式（ESM + CJS），适配所有场景
  format: ['esm', 'cjs'],
  // 目标环境：适配 Node 16+（企业级常用兼容基线）
  target: 'node24',
  // 输出目录
  outDir: 'dist',
  // 企业级必备：清空旧产物、生成 sourcemap、压缩代码
  clean: true,
  sourcemap: true, // 生产环境可关闭，调试时开启
  minify: true, // 压缩代码，减小体积
  // 自动注入 Node.js 内置模块 shim（避免打包后找不到 fs/path 等）
  shims: true,
  //   // 可选：替换源码中的环境变量
  //   define: {
  //     'process.env.CLI_VERSION': '"1.0.0"',
  //   },
});
