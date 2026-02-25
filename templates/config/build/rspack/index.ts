import type { ModifyRspackConfigFn } from '@rsbuild/core';
import { merge } from 'webpack-merge';
import { sassVars } from '../../style/sassVars';
import { publicPath } from '../../index';
import { getPlugins } from './plugin';

export const rspackConfig: ModifyRspackConfigFn = (config, { appendPlugins }) => {
  appendPlugins(getPlugins());
  return merge(config, {
    plugins: [],
    module: {
      rules: [
        {
          test: /\.scss$/,
          loader: require.resolve('@epegzz/sass-vars-loader'),
          options: {
            syntax: 'scss',
            vars: sassVars,
          },
        },
      ],
    },
    resolve: {},
    output: {
      publicPath,
    },
    externals: {},
  });
};
