# 🚀 Chen RSBuild CLI - 企业级 React 项目脚手架

<div align="center">

<!-- 作者头像 -->
<img src="https://github.com/wangchen2021.png" alt="Wang Chen" width="120" height="120" style="border-radius: 50%; border: 4px solid #3498db; margin-bottom: 20px;">

<h2>👨‍💻 作者: Wang Chen</h2>

<!-- 徽章 -->

![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-%3E%3D12.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![RSBuild](https://img.shields.io/badge/RSBuild-Latest-orange)
![Downloads](https://img.shields.io/npm/dt/@wangchen2021/chen-rsbuild-cli)
![Version](https://img.shields.io/npm/v/@wangchen2021/chen-rsbuild-cli)
![GitHub Stars](https://img.shields.io/github/stars/wangchen2021/chen-rsbuild-cli)
![GitHub Forks](https://img.shields.io/github/forks/wangchen2021/chen-rsbuild-cli)

**📧 邮箱: 1710312281@qq.com**  
**🐙 GitHub: [@wangchen2021](https://github.com/wangchen2021)**  
**💼 职位: 前端架构师**

**专业的企业级 React + TypeScript + RSBuild 项目初始化工具**

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [使用指南](#-使用指南) • [模板详情](#-模板详情) • [关于作者](#-关于作者)

</div>

## ✨ 概述

Chen RSBuild CLI 是一个现代化的企业级 React 项目脚手架工具，基于 RSBuild 构建系统，集成了 TypeScript、React 18+ 和最新的前端开发最佳实践。专为需要快速启动高质量、可维护、高性能 React 应用的企业和团队设计。

## 🚀 快速开始

### 系统要求

- **Node.js**: >= 12.0.0
- **包管理器**: pnpm (推荐), npm, yarn

### 全局安装

```bash
# 使用 pnpm (推荐)
pnpm install -g @wangchen2021/chen-rsbuild-cli

# 使用 npm
npm install -g @wangchen2021/chen-rsbuild-cli

# 使用 yarn
yarn global add @wangchen2021/chen-rsbuild-cli
```

### 创建新项目

```bash
# 创建新项目
chen-rsbuild-cli create <project-name>

# 示例
chen-rsbuild-cli create my-awesome-app
```

### 项目初始化流程

1. **输入项目名称**
2. **选择项目模板** (默认: 企业级模板)
3. **自动安装依赖**
4. **项目初始化完成**

创建完成后，进入项目目录并启动开发服务器：

```bash
cd <project-name>
pnpm run dev
```

项目将在 [http://localhost:3000](http://localhost:3000) 启动

## 🎯 功能特性

### 🏗️ **现代化架构**

- 📁 清晰的项目结构组织
- 🎯 基于功能模块的目录设计
- 🔧 可扩展的配置系统
- 🏢 企业级代码规范

### ⚡ **高性能构建**

- 🚀 基于 RSBuild 的极速构建
- 📦 智能代码分割和懒加载
- 🌳 摇树优化 (Tree Shaking)
- 🔥 热模块替换 (HMR)

### 🔒 **类型安全**

- 🛡️ TypeScript 严格模式
- 📝 完整的类型定义
- 🧪 类型安全的 API 调用
- 🔍 编译时类型检查

### 🎨 **开发体验**

- 🎭 内置 Storybook 支持
- 📝 ESLint + Prettier 代码规范
- 🐶 Husky Git 钩子
- 🔧 开发/生产环境配置

### 🌐 **企业级功能**

- 🔌 RESTful API 集成模式
- 📡 WebSocket 实时通信
- 🗄️ 状态管理 (Redux Toolkit)
- 🛡️ 安全最佳实践

## 📋 使用指南

### 命令行选项

```bash
# 创建新项目
chen-rsbuild-cli create <project-name>

# 查看版本信息
chen-rsbuild-cli --version
chen-rsbuild-cli -v

# 查看帮助信息
chen-rsbuild-cli --help
chen-rsbuild-cli -h

# 列出可用模板
chen-rsbuild-cli list-templates
```

### 项目结构

生成的项目包含以下核心目录：

```
<project-name>/
├── src/
│   ├── api/           # API 服务和配置
│   ├── components/    # 可复用 UI 组件
│   ├── pages/         # 页面组件和路由
│   ├── store/         # 状态管理
│   ├── styles/        # 样式和主题
│   ├── utils/         # 工具函数
│   ├── hooks/         # 自定义 Hooks
│   └── types/         # TypeScript 类型定义
├── public/            # 静态资源
├── tests/             # 测试文件
├── stories/           # Storybook 故事
└── config/            # 配置文件
```

### 开发脚本

```bash
# 开发模式
pnpm run dev           # 启动开发服务器

# 构建相关
pnpm run build         # 生产环境构建
pnpm run preview       # 预览生产构建

# 代码质量
pnpm run lint          # 代码检查
pnpm run format        # 代码格式化
pnpm run type-check    # TypeScript 类型检查

# 测试相关
pnpm run test          # 运行测试
pnpm run test:watch    # 监听模式运行测试

# 文档相关
pnpm run storybook     # 启动 Storybook
pnpm run build-storybook # 构建 Storybook
```

## 📦 模板详情

### 企业级模板特性

#### 1. **技术栈**

- **框架**: React 18+
- **语言**: TypeScript 5.0+
- **构建工具**: RSBuild
- **路由**: React Router v6
- **状态管理**: Redux Toolkit + RTK Query
- **样式方案**: CSS Modules + PostCSS
- **UI 组件**: 可自定义集成

#### 2. **开发工具**

- **代码检查**: ESLint + Airbnb 规范
- **代码格式化**: Prettier
- **Git 钩子**: Husky + lint-staged
- **提交规范**: Commitizen
- **包管理器**: pnpm (默认)

#### 3. **测试配置**

- **单元测试**: Jest + Testing Library
- **组件测试**: Storybook + Chromatic
- **E2E 测试**: Playwright (可选)
- **覆盖率**: Jest Coverage

#### 4. **部署优化**

- **Docker 支持**: 完整的 Dockerfile
- **CI/CD 配置**: GitHub Actions 模板
- **性能优化**: 代码分割、懒加载
- **SEO 友好**: 支持 SSR (可选)

### 环境配置

项目支持多环境配置：

```env
# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_DEBUG=true

# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_ENABLE_DEBUG=false
```

## 👨‍💻 关于作者

### Wang Chen - 前端架构师

**专业技能**:

- 🎯 前端架构设计与优化
- ⚡ 性能优化与用户体验
- 🛡️ TypeScript 高级应用
- 🏗️ 微前端架构
- 🔧 工程化与 DevOps

**技术栈**:

- **前端框架**: React, Vue, Angular
- **构建工具**: Webpack, Vite, RSBuild
- **状态管理**: Redux, MobX, Zustand
- **CSS 方案**: CSS-in-JS, Tailwind, Sass
- **测试框架**: Jest, Testing Library, Cypress

**开源贡献**:

- 📦 多个开源项目维护者
- 🔧 企业级工具链开发
- 📚 技术博客作者
- 🎓 技术分享讲师

**联系方式**:

- 📧 邮箱: 1710312281@qq.com
- 🐙 GitHub: [@wangchen2021](https://github.com/wangchen2021)
- 💼 LinkedIn: [Wang Chen](https://www.linkedin.com/in/wangchen)
- 🐦 Twitter: [@wangchen_dev](https://twitter.com/wangchen_dev)

## 🔧 高级配置

### 自定义模板

你可以创建自定义模板：

1. 在 `templates/` 目录下创建新模板
2. 修改模板配置文件
3. 通过 CLI 参数指定模板

```bash
chen-rsbuild-cli create <project-name> --template custom
```

### 插件系统

CLI 支持插件扩展：

- **模板插件**: 添加新的项目模板
- **命令插件**: 扩展 CLI 命令
- **配置插件**: 自定义项目配置

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

### 开发设置

```bash
# 克隆仓库
git clone https://github.com/wangchen2021/chen-rsbuild-cli.git
cd chen-rsbuild-cli

# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建 CLI
pnpm run build
```

### 提交规范

我们使用 Conventional Commits 规范：

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具更新

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint Airbnb 规范
- 所有导出必须有类型定义
- 组件使用函数式组件 + Hooks

## 📄 许可证

本项目基于 **MIT 许可证** 开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持与反馈

### 问题报告

如果你遇到任何问题或有功能建议：

1. 查看 [现有 Issues](https://github.com/wangchen2021/chen-rsbuild-cli/issues)
2. 创建 [新 Issue](https://github.com/wangchen2021/chen-rsbuild-cli/issues/new)

### 社区支持

- **GitHub Discussions**: 功能讨论和问题解答
- **GitHub Issues**: Bug 报告和功能请求
- **文档**: 完整的 API 文档和使用指南

## 📞 联系方式

- **作者**: Wang Chen
- **GitHub**: [@wangchen2021](https://github.com/wangchen2021)
- **邮箱**: 1710312281@qq.com
- **项目地址**: https://github.com/wangchen2021/chen-rsbuild-cli

---

<div align="center">

**Made with ❤️ by Wang Chen**

如果这个项目对你有帮助，请考虑给它一个 ⭐️

[报告问题](https://github.com/wangchen2021/chen-rsbuild-cli/issues) • [请求功能](https://github.com/wangchen2021/chen-rsbuild-cli/issues) • [贡献代码](CONTRIBUTING.md)

</div>
