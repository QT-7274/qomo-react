# 样式文件组织指南

## 📁 样式文件结构

```
src/
├── index.css                    # 主样式入口文件
├── styles/
│   ├── README.md               # 本文档
│   └── tea-overrides.css       # Tea Design 组件库样式覆盖
├── tailwind.config.js          # Tailwind CSS 配置
└── postcss.config.js           # PostCSS 配置
```

## 🎨 样式系统架构

### 1. 主样式入口 (`src/index.css`)

这是项目的主样式入口文件，按以下顺序组织：

```css
/* 1. 外部字体导入 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* 2. 第三方组件库样式 */
@import "tea-component/dist/tea.css";

/* 3. 自定义样式覆盖 */
@import "@/styles/tea-overrides.css";

/* 4. Tailwind CSS 核心层 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 5. 全局样式定义 */
:root {
  /* CSS 变量定义 */
}

/* 6. 全局元素样式 */
body {
  /* 全局样式 */
}
```

### 2. Tea Design 样式覆盖 (`src/styles/tea-overrides.css`)

专门用于覆盖 Tea Design 组件库的默认样式：

- **Card 组件**：圆角、阴影、间距优化
- **Button 组件**：统一按钮样式管理
- **Select 组件**：尺寸控制优化
- **TagSelect 组件**：最小高度设置

### 3. Tailwind CSS 配置 (`tailwind.config.js`)

扩展 Tailwind 的默认配置：

- **自定义颜色**：primary、secondary、accent 色彩系统
- **响应式断点**：根据项目需求调整
- **字体配置**：Inter 字体集成

## 🛠️ 新组件样式指南

### 创建新组件时的样式引入规范

#### 1. 优先级顺序

1. **Tailwind CSS 工具类**（推荐）
2. **Tea Design 组件样式**
3. **自定义 CSS 类**（必要时）
4. **内联样式**（避免使用）

#### 2. 推荐的样式写法

```tsx
// ✅ 推荐：使用 Tailwind 工具类
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
  <Button type="primary" size="m">
    保存
  </Button>
</div>

// ✅ 推荐：结合 Tea Design 组件
import { Card } from 'tea-component';

<Card className="mb-4">
  <Card.Header>标题</Card.Header>
  <Card.Body>内容</Card.Body>
</Card>

// ⚠️ 谨慎使用：自定义 CSS 类
<div className="custom-component-class">
  {/* 内容 */}
</div>

// ❌ 避免：内联样式
<div style={{ marginTop: '20px', color: 'red' }}>
  {/* 避免这种写法 */}
</div>
```

#### 3. 样式工具函数

使用项目提供的样式工具函数：

```tsx
import { cn } from '@/utils';

// 条件样式合并
const buttonClass = cn(
  'base-button-class',
  {
    'active-class': isActive,
    'disabled-class': disabled,
  },
  className
);
```

## 📋 样式开发规范

### 1. 命名规范

- **CSS 类名**：使用 kebab-case（如：`custom-button-primary`）
- **CSS 变量**：使用 kebab-case 带前缀（如：`--app-primary-color`）
- **组件样式**：使用 BEM 方法论（如：`component__element--modifier`）

### 2. 响应式设计

使用 Tailwind 的响应式前缀：

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* 响应式宽度 */}
</div>
```

### 3. 颜色系统

使用配置化的颜色系统：

```tsx
import { COLOR_THEMES } from '@/config/constants';
import { COMPONENT_COLORS } from '@/config/theme';

// 使用配置化颜色
const color = COMPONENT_COLORS[COLOR_THEMES.PRIMARY];
```

### 4. 间距系统

遵循 Tailwind 的间距系统：

```tsx
// 使用标准间距
<div className="p-4 m-2 gap-3">
  {/* 4 = 1rem, 2 = 0.5rem, 3 = 0.75rem */}
</div>
```

## 🔧 样式调试与维护

### 1. 样式冲突解决

1. **检查样式优先级**：Tailwind utilities > Tea Design > 自定义样式
2. **使用 `!important`**：仅在必要时使用，优先考虑提高选择器特异性
3. **检查样式覆盖**：确认 `tea-overrides.css` 中的覆盖是否生效

### 2. 性能优化

1. **避免重复样式**：使用 Tailwind 的 `@apply` 指令提取重复样式
2. **按需加载**：确保只加载使用的样式
3. **样式压缩**：生产环境自动压缩 CSS

### 3. 样式一致性检查

定期检查以下项目：

- [ ] 所有组件使用统一的颜色系统
- [ ] 间距使用标准的 Tailwind 值
- [ ] 字体大小遵循设计系统
- [ ] 响应式断点一致

## 📚 相关资源

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Tea Design 组件库](https://tea-design.github.io/component/)
- [项目配置系统文档](../config/README.md)
- [开发规范指南](../docs/DEVELOPMENT_GUIDE.md)

## 🚀 快速开始

创建新组件时的样式检查清单：

1. [ ] 使用 `@/` 别名导入所有依赖
2. [ ] 优先使用 Tailwind CSS 工具类
3. [ ] 使用 Tea Design 组件时检查样式覆盖
4. [ ] 避免内联样式和硬编码值
5. [ ] 确保响应式设计兼容性
6. [ ] 使用配置化的颜色和主题系统
