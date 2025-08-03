# Qomo - AI提示词模板化工具

<div align="center">

![Qomo Logo](./public/qomo-logo.svg)

**基于腾讯云EdgeOne Pages构建的智能AI提示词管理平台**

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=vite-react)

**Languages:** [English](README.en.md) | [中文](README.md)

[在线体验](https://qomo.site) | [功能演示](#功能特性) | [技术架构](#技术架构) | [EdgeOne集成](#edgeone-pages-深度集成)

</div>

## 📋 项目简介

Qomo是一款革命性的AI提示词模板化工具，通过独创的组件化系统解决AI工具使用中的两大核心痛点：**语义理解偏差**和**重复输入低效**。基于腾讯云EdgeOne Pages的云原生架构，为全球用户提供毫秒级响应的AI创作体验。

### 🎯 核心价值

- **🧩 组件化编排**：将提示词拆分为可复用的功能组件（角色设定、约束条件、上下文等）
- **🎨 可视化拖拽**：基于React DnD的直观拖拽界面，零学习成本构建复杂提示词
- **📚 知识库沉淀**：个人模板库和公共社区，让AI使用经验可积累、可分享
- **🌐 全球加速**：EdgeOne CDN确保全球用户的极速访问体验
- **☁️ 云端同步**：多设备实时同步，创作内容永不丢失

## 🚀 功能特性

### 核心功能

- **📝 模板编辑器**
  - 可视化拖拽组件排序
  - 实时预览生成的提示词
  - 支持创建模式和使用模式切换
  - 智能组件推荐和约束检查

- **🗂️ 模板库管理**
  - 个人模板库和公共模板社区
  - 按分类、标签筛选和搜索
  - 模板评分和使用统计
  - 一键应用和快速复制

- **🧱 组件库系统**
  - 6种核心组件类型（角色设定、具体问题、后置要求、上下文、约束条件、示例）
  - 组件复用和批量管理
  - 智能组件推荐
  - 自定义组件创建

- **🌍 国际化支持**
  - 中英文界面切换
  - 基于地理位置的智能语言推荐
  - 完整的多语言文本管理系统

### 高级功能

- **☁️ 云端同步**：基于EdgeOne KV存储的多设备同步
- **🤖 AI优化**：智能提示词分析和改进建议（预留功能）
- **📊 使用统计**：模板使用情况和效果分析
- **🔄 版本控制**：模板版本管理和回滚功能

## 🏗️ 技术架构

### 前端技术栈

```
React 18 + TypeScript + Vite
├── UI框架: Tea Design 组件库
├── 状态管理: Zustand + 持久化存储
├── 拖拽系统: React DnD + HTML5 Backend
├── 动画引擎: Framer Motion
├── 样式方案: Tailwind CSS + 响应式设计
├── 路由管理: React Router v7
├── 表单处理: React Hook Form
└── 国际化: 自研i18n系统 + 地理位置检测
```

### 项目结构

```
src/
├── components/          # 组件目录
│   ├── common/         # 通用组件
│   ├── template/       # 模板相关组件
│   ├── ui/            # 基础UI组件
│   └── layout/        # 布局组件
├── pages/             # 页面组件
├── store/             # Zustand状态管理
├── i18n/              # 国际化系统
├── config/            # 配置文件
├── utils/             # 工具函数
├── types/             # TypeScript类型定义
└── styles/            # 样式文件

functions/             # EdgeOne Pages 边缘函数
├── api/
│   ├── templates/     # 模板管理API
│   ├── kv/           # KV存储API
│   ├── geo/          # 地理位置服务
│   ├── ai/           # AI优化服务
│   └── test/         # 测试接口
```

## 🌟 EdgeOne Pages 深度集成

### 🔧 边缘函数 (Edge Functions)

Qomo充分利用EdgeOne Pages的边缘计算能力，实现了完整的Serverless API生态：

#### 模板管理API
- **`/api/templates/save`** - 模板云端保存，支持地理位置标识
- **`/api/templates/list`** - 获取用户模板列表和公开模板
- **`/api/templates/delete`** - 安全删除模板，包含权限验证

#### KV存储代理API
- **`/api/kv/[action]`** - 通用KV操作接口（put/get/delete/list）
- 支持用户数据隔离和多租户架构
- 自动处理CORS和错误处理

#### 地理位置智能服务
- **`/api/geo/info`** - 基于EdgeOne地理位置信息的语言推荐
- 自动检测用户地区并推荐最适合的界面语言
- 支持地理位置缓存和离线降级

#### AI优化服务（预留）
- **`/api/ai/optimize`** - 提示词智能分析和优化建议
- **`/api/ai/translate`** - 多语言提示词翻译
- **`/api/ai/analyze`** - 提示词质量评分和改进建议

#### 测试和调试API
- **`/api/test/kv`** - KV存储功能完整性测试
- **`/api/test/counter`** - 访问计数器和系统状态监控
- **`/api/debug/keys`** - 开发环境KV键名查看

### 💾 EdgeOne KV 存储

#### 数据架构设计
```
KV存储键名规范:
├── user:{userId}:templates:{templateId}     # 用户私有模板
├── public:templates:{templateId}           # 公开模板社区
├── user:{userId}:components:{componentId}  # 用户组件库
├── template:{geoId}:{userId}:{templateId}  # 地理位置标识的模板
└── system:config:{configKey}               # 系统配置
```

#### 核心特性
- **多设备同步**：实时云端存储，支持离线编辑和联网同步
- **数据隔离**：用户数据完全隔离，支持公开模板社区
- **地理优化**：基于地理位置的数据分布和访问优化
- **版本管理**：模板版本控制和冲突解决机制

### 🌐 全球CDN加速

- **边缘节点分布**：利用EdgeOne全球节点网络，确保毫秒级响应
- **智能缓存**：静态资源CDN缓存 + API响应智能缓存
- **动态加速**：基于地理位置的最优路径选择

### 🚀 预览分支部署

- **零风险验证**：每个Git分支自动生成独立预览环境
- **实时协作**：团队成员通过预览链接直接体验新功能
- **A/B测试**：并行部署不同方案，数据驱动产品决策

### 🛡️ 安全防护

- **DDoS防护**：EdgeOne内置的分布式拒绝服务攻击防护
- **WAF防火墙**：Web应用防火墙，过滤恶意请求
- **数据加密**：传输和存储全程加密保护

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- 现代浏览器（支持ES2020+）

### 本地开发

```bash
# 克隆项目
git clone https://github.com/your-username/qomo-react.git
cd qomo-react

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:5173

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### EdgeOne Pages 部署

1. **创建EdgeOne Pages项目**
   ```bash
   # 直接使用模板创建
   https://console.cloud.tencent.com/edgeone/pages/new?template=vite-react
   ```

2. **配置KV存储**
   - 在EdgeOne Pages控制台创建KV命名空间
   - 命名空间名称：`qomo-templates`
   - 绑定变量名：`qomo`

3. **环境变量配置**
   ```bash
   # 在EdgeOne Pages控制台配置
   qomo=your-kv-namespace-id
   AI_API_KEY=your-ai-api-key (可选)
   ```

4. **部署项目**
   - 连接GitHub仓库
   - 自动部署：推送代码即可触发部署
   - 预览分支：每个分支自动生成预览环境

## 📚 使用指南

### 创建模板

1. 进入编辑器页面，选择"创建模板"模式
2. 填写模板基本信息（名称、描述、分类）
3. 从组件库拖拽组件到编辑区域
4. 调整组件顺序和内容
5. 实时预览生成的提示词
6. 保存模板到个人库或发布到公开库

### 使用模板

1. 切换到"使用模板"模式
2. 输入具体问题
3. 系统自动基于模板组件生成完整提示词
4. 一键复制到AI工具使用

### 管理组件库

1. 访问组件库页面
2. 查看和管理个人组件
3. 创建自定义组件
4. 批量导入/导出组件

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细信息。

### 开发规范

- 使用TypeScript进行类型安全开发
- 遵循ESLint和Prettier代码规范
- 组件开发使用Tea Design组件库
- 所有文本使用国际化系统管理
- 提交前运行完整的测试套件

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。

## 🙏 致谢

- [腾讯云EdgeOne Pages](https://cloud.tencent.com/product/edgeone-pages) - 提供强大的云原生部署平台
- [Tea Design](https://tea-design.github.io/component/) - 优秀的React组件库
- [React DnD](https://react-dnd.github.io/react-dnd/) - 强大的拖拽功能实现
- [Framer Motion](https://www.framer.com/motion/) - 流畅的动画体验

---

<div align="center">
</div>
