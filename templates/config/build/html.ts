import type { HtmlConfig } from '@rsbuild/core';

export const htmlTitle = 'Chen';

export const htmlConfig: HtmlConfig = {
  title: htmlTitle,
  template: './public/index.html',
  favicon: './public/favicon.png',
  templateParameters: {
    title: htmlTitle,
  },
  // cdn缓冲三方库
  // tags: (isProduction
  //   ? [
  //     `${CDN}/node_modules/react/react.production.js`,
  //     `${CDN}/node_modules/react/react-dom.production.js`,
  //   ]
  //   : [
  //     `${CDN}/node_modules/react/react.development.js`,
  //     `${CDN}/node_modules/react/react-dom.development.js`,
  //   ]
  // ).map((i) => ({
  //   tag: 'script',
  //   attrs: {
  //     src: i,
  //     defer: true,
  //   },
  //   head: true,
  //   append: false,
  // })),
};
