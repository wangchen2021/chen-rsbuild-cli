import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import path from 'path';
import { ENV_CONFIG } from './config';
import { interpolateName } from 'loader-utils';
import { launchEditorMiddleware } from '@react-dev-inspector/middleware';
import { htmlConfig, rspackConfig } from './config/build';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSvgr(),
    pluginSass(),
    pluginNodePolyfill(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift('babel-plugin-react-compiler');
      },
    }),
  ],
  html: htmlConfig,
  output: {
    filenameHash: true,
    distPath: {
      root: 'dist',
    },
    polyfill: 'entry',
    minify: {
      jsOptions: {
        minimizerOptions: {
          mangle: {
            keep_fnames: true,
          },
        },
      },
    },
    cssModules: {
      auto: (resource) => {
        return (
          resource.endsWith('.scss') || resource.endsWith('.css') || resource.endsWith('.less')
        );
      },
    },
  },
  source: {
    define: {
      ENV_CONFIG: JSON.stringify(ENV_CONFIG),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  tools: {
    rspack: rspackConfig,
    cssLoader: {
      modules: {
        localIdentName: '[hash:base64:5]',
        getLocalIdent: (
          context: {
            resourcePath: string;
          },
          localIdentName: string,
          localName: string,
        ) => {
          const staticClassPath = ['node_modules', 'ant.design.less', 'global.less', 'app.css'];
          const isStaticClass = staticClassPath.some((i) => context.resourcePath.includes(i));
          if (isStaticClass) {
            return localName;
          }
          const matchSrc = context.resourcePath.match(/src(.*)/);
          const matchScss = context.resourcePath.match(/\.(sass|scss)(\?.*)?$/);
          const normalizePath = (file: string) => {
            return path.sep === '\\' ? file.replace(/\\/g, '/') : file;
          };
          if (matchSrc && matchScss && matchSrc[1]) {
            const request = normalizePath(
              path.relative(path.resolve(__dirname, 'src'), context.resourcePath),
            );
            const content = `${request}\x00${localName}`;
            return `${localName}__${interpolateName(context as any, localIdentName, { content })}`.replace(
              /\.|\+|%|\/|=/g,
              '_',
            );
          }
          return localName;
        },
      },
    },
  },
  dev: {
    // 自定义中间件配置
    setupMiddlewares: [
      (middlewares) => {
        // 添加 React Dev Inspector 中间件，用于开发时定位组件
        middlewares.unshift(launchEditorMiddleware);
      },
    ],
  },
  performance: {
    removeMomentLocale: true,
    removeConsole: ['log', 'info', 'table', 'group'],
  },
});
