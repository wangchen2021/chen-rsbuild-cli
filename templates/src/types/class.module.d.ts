/**
 * 全局类型定义
 * 为CSS/SCSS模块添加TypeScript类型支持
 */

// CSS Modules 类型定义
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// SCSS Modules 类型定义
declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// LESS Modules 类型定义
declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}
