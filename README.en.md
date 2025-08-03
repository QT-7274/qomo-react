# Qomo - AI Prompt Template Tool

<div align="center">

![Qomo Logo](./public/qomo-logo.svg)

**Intelligent AI Prompt Management Platform Built on Tencent Cloud EdgeOne Pages**

[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=vite-react)

**Languages:** [English](README.en.md) | [中文](README.md)

[Live Demo](https://qomo.site) | [Features](#features) | [Tech Stack](#tech-architecture) | [EdgeOne Integration](#edgeone-pages-deep-integration)

</div>

## 📋 Project Overview

Qomo is a revolutionary AI prompt template tool that solves two core pain points in AI tool usage through an innovative component-based system: **semantic understanding gaps** and **repetitive input inefficiency**. Built on Tencent Cloud EdgeOne Pages' cloud-native architecture, it provides millisecond-level response AI creation experience for global users.

### 🎯 Core Values

- **🧩 Component-based Orchestration**: Break down prompts into reusable functional components (role setting, constraints, context, etc.)
- **🎨 Visual Drag & Drop**: Intuitive drag-and-drop interface based on React DnD with zero learning curve
- **📚 Knowledge Base Accumulation**: Personal template library and public community for shareable AI experience
- **🌐 Global Acceleration**: EdgeOne CDN ensures ultra-fast access for global users
- **☁️ Cloud Synchronization**: Real-time multi-device sync, never lose your creations

## 🚀 Features

### Core Features

- **📝 Template Editor**
  - Visual drag-and-drop component sorting
  - Real-time preview of generated prompts
  - Support for create mode and use mode switching
  - Smart component recommendations and constraint checking

- **🗂️ Template Library Management**
  - Personal template library and public template community
  - Filter and search by category, tags
  - Template rating and usage statistics
  - One-click apply and quick copy

- **🧱 Component Library System**
  - 6 core component types (role setting, specific questions, post requirements, context, constraints, examples)
  - Component reuse and batch management
  - Smart component recommendations
  - Custom component creation

- **🌍 Internationalization Support**
  - Chinese/English interface switching
  - Smart language recommendation based on geolocation
  - Complete multilingual text management system

### Advanced Features

- **☁️ Cloud Sync**: Multi-device sync based on EdgeOne KV storage
- **🤖 AI Optimization**: Smart prompt analysis and improvement suggestions (reserved feature)
- **📊 Usage Analytics**: Template usage and effectiveness analysis
- **🔄 Version Control**: Template version management and rollback functionality

## 🏗️ Tech Architecture

### Frontend Tech Stack

```
React 18 + TypeScript + Vite
├── UI Framework: Tea Design Component Library
├── State Management: Zustand + Persistent Storage
├── Drag System: React DnD + HTML5 Backend
├── Animation Engine: Framer Motion
├── Styling: Tailwind CSS + Responsive Design
├── Routing: React Router v7
├── Form Handling: React Hook Form
└── Internationalization: Custom i18n System + Geo Detection
```

### Project Structure

```
src/
├── components/          # Component directory
│   ├── common/         # Common components
│   ├── template/       # Template-related components
│   ├── ui/            # Basic UI components
│   └── layout/        # Layout components
├── pages/             # Page components
├── store/             # Zustand state management
├── i18n/              # Internationalization system
├── config/            # Configuration files
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── styles/            # Style files

functions/             # EdgeOne Pages Edge Functions
├── api/
│   ├── templates/     # Template management API
│   ├── kv/           # KV storage API
│   ├── geo/          # Geolocation service
│   ├── ai/           # AI optimization service
│   └── test/         # Test interfaces
```

## 🌟 EdgeOne Pages Deep Integration

### 🔧 Edge Functions

Qomo fully leverages EdgeOne Pages' edge computing capabilities to implement a complete Serverless API ecosystem:

#### Template Management API
- **`/api/templates/save`** - Cloud template saving with geolocation identification
- **`/api/templates/list`** - Get user template list and public templates
- **`/api/templates/delete`** - Secure template deletion with permission verification

#### KV Storage Proxy API
- **`/api/kv/[action]`** - Universal KV operation interface (put/get/delete/list)
- Support for user data isolation and multi-tenant architecture
- Automatic CORS and error handling

#### Geolocation Intelligence Service
- **`/api/geo/info`** - Language recommendation based on EdgeOne geolocation info
- Auto-detect user region and recommend optimal interface language
- Support for geolocation caching and offline fallback

#### AI Optimization Service (Reserved)
- **`/api/ai/optimize`** - Smart prompt analysis and optimization suggestions
- **`/api/ai/translate`** - Multi-language prompt translation
- **`/api/ai/analyze`** - Prompt quality scoring and improvement suggestions

#### Testing and Debug API
- **`/api/test/kv`** - KV storage functionality integrity testing
- **`/api/test/counter`** - Access counter and system status monitoring
- **`/api/debug/keys`** - Development environment KV key viewing

### 💾 EdgeOne KV Storage

#### Data Architecture Design
```
KV Storage Key Naming Convention:
├── user:{userId}:templates:{templateId}     # User private templates
├── public:templates:{templateId}           # Public template community
├── user:{userId}:components:{componentId}  # User component library
├── template:{geoId}:{userId}:{templateId}  # Geo-identified templates
└── system:config:{configKey}               # System configuration
```

#### Core Features
- **Multi-device Sync**: Real-time cloud storage, support offline editing and online sync
- **Data Isolation**: Complete user data isolation, support public template community
- **Geographic Optimization**: Data distribution and access optimization based on geolocation
- **Version Management**: Template version control and conflict resolution mechanism

### 🌐 Global CDN Acceleration

- **Edge Node Distribution**: Leverage EdgeOne's global node network for millisecond response
- **Smart Caching**: Static resource CDN caching + API response intelligent caching
- **Dynamic Acceleration**: Optimal path selection based on geolocation

### 🚀 Preview Branch Deployment

- **Zero-risk Verification**: Each Git branch automatically generates independent preview environment
- **Real-time Collaboration**: Team members experience new features directly through preview links
- **A/B Testing**: Parallel deployment of different solutions, data-driven product decisions

### 🛡️ Security Protection

- **DDoS Protection**: EdgeOne's built-in distributed denial-of-service attack protection
- **WAF Firewall**: Web application firewall filtering malicious requests
- **Data Encryption**: End-to-end encryption protection for transmission and storage

## 🚀 Quick Start

### Requirements

- Node.js 18+
- npm or yarn
- Modern browser (ES2020+ support)

### Local Development

```bash
# Clone the project
git clone https://github.com/your-username/qomo-react.git
cd qomo-react

# Install dependencies
npm install

# Start development server
npm run dev
# Visit http://localhost:5173

# Build for production
npm run build

# Preview build
npm run preview
```

### EdgeOne Pages Deployment

1. **Create EdgeOne Pages Project**
   ```bash
   # Create directly using template
   https://console.cloud.tencent.com/edgeone/pages/new?template=vite-react
   ```

2. **Configure KV Storage**
   - Create KV namespace in EdgeOne Pages console
   - Namespace name: `qomo-templates`
   - Binding variable name: `qomo`

3. **Environment Variables Configuration**
   ```bash
   # Configure in EdgeOne Pages console
   qomo=your-kv-namespace-id
   AI_API_KEY=your-ai-api-key (optional)
   ```

4. **Deploy Project**
   - Connect GitHub repository
   - Auto deployment: Push code to trigger deployment
   - Preview branches: Each branch automatically generates preview environment

## 📚 Usage Guide

### Creating Templates

1. Enter editor page, select "Create Template" mode
2. Fill in template basic information (name, description, category)
3. Drag components from component library to editing area
4. Adjust component order and content
5. Real-time preview of generated prompts
6. Save template to personal library or publish to public library

### Using Templates

1. Switch to "Use Template" mode
2. Input specific questions
3. System automatically generates complete prompts based on template components
4. One-click copy to AI tools

### Managing Component Library

1. Visit component library page
2. View and manage personal components
3. Create custom components
4. Batch import/export components

## 🤝 Contributing

We welcome all forms of contributions! Please check [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Development Guidelines

- Use TypeScript for type-safe development
- Follow ESLint and Prettier code standards
- Use Tea Design component library for component development
- Manage all text using internationalization system
- Run complete test suite before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Tencent Cloud EdgeOne Pages](https://cloud.tencent.com/product/edgeone-pages) - Powerful cloud-native deployment platform
- [Tea Design](https://tea-design.github.io/component/) - Excellent React component library
- [React DnD](https://react-dnd.github.io/react-dnd/) - Powerful drag-and-drop functionality
- [Framer Motion](https://www.framer.com/motion/) - Smooth animation experience

---

<div align="center">

**Make AI interactions more precise, make creation more efficient** 🚀

</div>
