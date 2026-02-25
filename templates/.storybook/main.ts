import type { StorybookConfig } from 'storybook-react-rsbuild';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-docs',
      options: {
        // autodocs: 'tag', // 自动生成文档：仅给带@component标签的组件生成（企业推荐）
        autodocs: 'all', // 可选：给所有组件生成自动文档（适合小型组件库）
      },
    },
    '@storybook/react-docgen-typescript-plugin',
  ],
  framework: 'storybook-react-rsbuild',
};
export default config;
