# 项目开发规范指南

## 📋 概述

本文档定义了项目的开发规范，确保代码的一致性、可维护性和团队协作效率。

## 🏗️ 项目架构

### 目录结构

```
src/
├── components/          # 组件目录
│   ├── common/         # 通用组件
│   ├── component/      # 业务组件
│   ├── dev/           # 开发工具组件
│   ├── layout/        # 布局组件
│   ├── question/      # 问题相关组件
│   ├── talent/        # 人才相关组件
│   ├── template/      # 模板相关组件
│   └── ui/            # UI 基础组件
├── config/            # 配置文件
├── data/              # 数据文件
├── pages/             # 页面组件
├── store/             # 状态管理
├── styles/            # 样式文件
├── types/             # 类型定义
└── utils/             # 工具函数
```

## 📝 代码规范

### 1. 导入规范

#### ✅ 推荐的导入方式

```tsx
// 1. React 相关导入
import React, { useState, useEffect } from 'react';

// 2. 第三方库导入
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// 3. UI 组件库导入
import { Card, Button } from 'tea-component';
import { Plus, Edit, Trash2 } from 'lucide-react';

// 4. 项目内部导入（使用 @ 别名）
import { useAppStore } from '@/store/useAppStore';
import { Template, ComponentType } from '@/types';
import { generateId, cn } from '@/utils';
import { ROUTES, COMPONENT_TYPES } from '@/config/constants';
import { BUTTON_TEXTS, NOTIFICATIONS } from '@/config/text';

// 5. 相对路径导入（仅限同级或子级组件）
import TemplateCard from './TemplateCard';
import { SubComponent } from './components/SubComponent';
```

#### ❌ 避免的导入方式

```tsx
// ❌ 避免：相对路径导入上级目录
import { Template } from '../../types';
import { useAppStore } from '../../store/useAppStore';

// ❌ 避免：混合导入方式
import { Template } from '@/types';
import { ComponentType } from '../../types';
```

### 2. 组件规范

#### 组件文件结构

```tsx
/**
 * 组件功能描述
 * 详细说明组件的用途、特性和使用场景
 */

// 导入部分（按上述规范）
import React from 'react';
// ... 其他导入

// 类型定义
interface ComponentProps {
  // 属性定义，包含详细注释
  title: string; // 组件标题
  onSave?: () => void; // 保存回调函数，可选
  className?: string; // 自定义样式类名
}

// 主组件
const ComponentName: React.FC<ComponentProps> = ({
  title,
  onSave,
  className
}) => {
  // 状态定义
  const [isLoading, setIsLoading] = useState(false);
  
  // 副作用处理
  useEffect(() => {
    // 副作用逻辑
  }, []);
  
  // 事件处理函数
  const handleSave = () => {
    // 处理逻辑
    onSave?.();
  };
  
  // 渲染逻辑
  return (
    <div className={cn('base-styles', className)}>
      {/* 组件内容 */}
    </div>
  );
};

export default ComponentName;
```

#### 组件命名规范

- **文件名**：使用 PascalCase（如：`TemplateCard.tsx`）
- **组件名**：与文件名保持一致
- **Props 接口**：组件名 + `Props`（如：`TemplateCardProps`）

### 3. 样式规范

#### 样式优先级

1. **Tailwind CSS 工具类**（首选）
2. **Tea Design 组件样式**
3. **全局样式覆盖**（`tea-overrides.css`）
4. **组件级自定义样式**（必要时）

#### 样式写法示例

```tsx
// ✅ 推荐：使用 Tailwind 工具类
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
  
// ✅ 推荐：条件样式
const cardClass = cn(
  'base-card-styles',
  {
    'active-styles': isActive,
    'disabled-styles': disabled,
  },
  className
);

// ✅ 推荐：响应式样式
<div className="w-full md:w-1/2 lg:w-1/3">
```

### 4. 配置化开发

#### 使用配置常量

```tsx
// ✅ 推荐：使用配置化常量
import { BUTTON_TEXTS, NOTIFICATIONS } from '@/config/text';
import { ROUTES, COMPONENT_TYPES } from '@/config/constants';
import { COMPONENT_COLORS } from '@/config/theme';

// 在组件中使用
<Button>{BUTTON_TEXTS.SAVE}</Button>
<Input placeholder={PLACEHOLDERS.TEMPLATE_NAME} />

// ❌ 避免：硬编码文本
<Button>保存</Button>
<Input placeholder="请输入模板名称..." />
```

## 🔧 开发工具配置

### TypeScript 配置

项目已配置路径映射：

```json
{
  "paths": {
    "@/*": ["src/*"],
    "@": ["src"]
  }
}
```

### ESLint 规则

遵循项目的 ESLint 配置，主要规则：

- 使用 TypeScript 严格模式
- React Hooks 规则检查
- 未使用变量警告（已配置为关闭）

## 📦 新组件创建流程

### 1. 确定组件位置

根据组件功能选择合适的目录：

- `components/ui/` - 基础 UI 组件
- `components/common/` - 通用业务组件
- `components/template/` - 模板相关组件
- `components/question/` - 问题相关组件

### 2. 创建组件文件

```bash
# 创建组件文件
touch src/components/category/ComponentName.tsx
```

### 3. 组件开发检查清单

创建新组件时请确认：

- [ ] 使用 `@/` 别名导入所有依赖
- [ ] 添加详细的中文注释
- [ ] 定义清晰的 TypeScript 接口
- [ ] 使用配置化的文本和常量
- [ ] 优先使用 Tailwind CSS 工具类
- [ ] 确保响应式设计兼容性
- [ ] 添加适当的错误处理
- [ ] 考虑组件的可复用性

### 4. 样式引入指南

新组件需要的样式文件会自动通过以下方式引入：

1. **全局样式**：通过 `src/index.css` 自动引入
2. **Tailwind CSS**：通过类名自动应用
3. **Tea Design**：通过组件导入自动应用
4. **自定义覆盖**：通过 `tea-overrides.css` 自动应用

**无需手动引入额外的样式文件**，除非有特殊需求。

## 🧪 测试规范

### 组件测试

建议为每个组件编写测试：

```tsx
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('应该正确渲染组件', () => {
    render(<ComponentName title="测试标题" />);
    expect(screen.getByText('测试标题')).toBeInTheDocument();
  });
});
```

## 📚 相关文档

- [样式文件组织指南](../styles/README.md)
- [配置系统使用指南](../config/USAGE_GUIDE.md)
- [配置架构指南](../config/README.md)
- [项目更新日志](../../CHANGELOG_INTERNAL.md)

## 🚀 快速参考

### 常用导入模板

```tsx
// 标准组件导入模板
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from 'tea-component';
import { Plus, Edit } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ComponentType } from '@/types';
import { cn, generateId } from '@/utils';
import { BUTTON_TEXTS } from '@/config/text';
import { ROUTES } from '@/config/constants';
```

### 常用工具函数

```tsx
// 样式合并
import { cn } from '@/utils';
const className = cn('base-class', conditionalClass, props.className);

// ID 生成
import { generateId } from '@/utils';
const id = generateId();

// 图标映射
import { getIcon } from '@/utils/iconMap';
const IconComponent = getIcon('plus');
```

遵循这些规范将确保项目代码的一致性和可维护性。
