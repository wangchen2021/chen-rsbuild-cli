# 🚀 RSBuild 企业级启动模板

<div align="center">

![RSBuild](https://img.shields.io/badge/RSBuild-React-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)
![React](https://img.shields.io/badge/React-19+-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

**下一代企业级 React 应用模板**

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [架构设计](#-架构设计) • [开发指南](#-开发指南)

</div>

## ✨ 概述

RSBuild 企业级启动模板是一个基于 React、TypeScript 和 RSBuild 的生产就绪级现代 Web 应用模板。该模板提供了构建可扩展、高性能、可维护应用所需的一切。

## 🚀 快速开始

### 环境要求

- Node.js 24+
- pnpm 9+（推荐

### 安装步骤

```bash
# 克隆仓库
git clone <你的项目仓库>
cd <项目名称>

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动

## 🎯 功能特性

### 🏎️ **性能优化**

- ⚡ 基于 RSBuild 的闪电般快速构建
- 🎯 优化的生产构建
- 📦 自动代码分割
- 🔥 热模块替换 (HMR)

### 🛡️ **企业级特性**

- 🔒 TypeScript 类型安全
- 🧪 完整的测试配置
- 📊 内置分析和监控
- 🔐 安全的身份验证模式

### 🎨 **现代化开发体验**

- 🎭 Storybook 组件开发
- 📝 ESLint + Prettier 代码质量
- 🐶 Husky Git 钩子
- 📦 支持 Monorepo 结构

### 🌐 **全栈能力**

- 🔌 REST API 集成
- 📡 WebSocket 支持
- 🗄️ 数据库模型和迁移
- 🔄 Redux Toolkit 状态管理

## 🏗️ 架构设计

```
src/
├── api/              # API 服务和配置
├── components/       # 可复用 UI 组件
├── pages/           # 页面组件和路由
├── store/           # Redux store 和切片
├── styles/          # 全局样式和主题
├── utils/           # 工具函数和助手
├── hooks/           # 自定义 React Hooks
└── types/           # TypeScript 类型定义
```

## 🛠️ 开发指南

### 可用脚本

```bash
# 启动开发服务器
pnpm run dev

# 生产构建
pnpm run build

# 预览生产构建
pnpm run preview

# 运行测试
pnpm run test

# 启动 Storybook
pnpm run storybook

# 代码检查
pnpm run lint

# 代码格式化
pnpm run format
```

### 环境变量

在根目录创建 `.env` 文件：

```env
# API 配置
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# 功能开关
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

## 📦 部署

### Docker 部署

```bash
# 构建 Docker 镜像
docker build -t your-app .

# 运行容器
docker run -p 3000:3000 your-app
```

### 传统部署

1. 构建应用：

   ```bash
   pnpm run build
   ```

2. 构建文件将在 `dist` 目录中

3. 将 `dist` 文件夹部署到你喜欢的托管服务

## 🔧 配置

### RSBuild 配置

RSBuild 配置文件位于 `rsbuild.config.ts`，主要配置包括：

- **构建优化** - 代码分割、摇树优化
- **资源处理** - 图片优化、字体加载
- **开发服务器** - 代理配置、HMR
- **生产构建** - 代码压缩、Source Maps

### TypeScript 配置

TypeScript 配置启用了严格模式，包括：

- 路径别名，便于导入
- 严格的类型检查
- 现代 ECMAScript 特性

## 📚 文档

### 组件开发

我们使用 Storybook 进行组件开发和文档：

```bash
# 启动 Storybook
pnpm run storybook
```

访问 [http://localhost:6006](http://localhost:6006) 查看和开发组件。

## 🤝 贡献

我们欢迎贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

### 开发流程

1. Fork 仓库
2. 创建功能分支
3. 进行修改
4. 运行测试和代码检查
5. 提交 Pull Request

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🏆 致谢

- [RSBuild](https://rsbuild.rs) - 驱动此模板的构建工具
- [React](https://reactjs.org) - UI 库
- [TypeScript](https://typescriptlang.org) - 类型安全
- [所有贡献者](https://github.com/your-org/your-repo/graphs/contributors)

---
