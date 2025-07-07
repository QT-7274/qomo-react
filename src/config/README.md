# 配置文件架构重构指南

## 问题分析

原有的 `appConfig.ts` 文件存在以下问题：

1. **高耦合度**：所有配置混在一个文件中，难以维护
2. **硬编码字符串**：文本内容散布在配置中，难以统一修改
3. **缺乏类型安全**：字符串常量容易出现拼写错误
4. **国际化困难**：文本内容与逻辑配置混合，不利于多语言支持
5. **主题系统缺失**：颜色、样式等视觉配置分散

## 解决方案

### 新的配置架构

```
src/config/
├── constants.ts      # 常量定义（类型、枚举等）
├── text.ts          # 文本内容（标签、消息等）
├── theme.ts         # 主题配置（颜色、样式等）
├── appConfig.v2.ts  # 重构后的应用配置
└── README.md        # 本文档
```

### 1. 常量分离 (`constants.ts`)

**优势：**
- 类型安全：使用 `as const` 确保类型推断
- 避免拼写错误：IDE 自动补全和检查
- 统一管理：所有常量集中定义

**示例：**
```typescript
export const COMPONENT_TYPES = {
  PREFIX: 'prefix',
  CONTEXT: 'context',
  // ...
} as const;

export type ComponentType = typeof COMPONENT_TYPES[keyof typeof COMPONENT_TYPES];
```

### 2. 文本内容分离 (`text.ts`)

**优势：**
- 便于国际化：所有文本集中管理
- 统一修改：修改文案只需要改一个地方
- 内容与逻辑分离：提高代码可读性

**示例：**
```typescript
export const BUTTON_TEXTS = {
  SAVE: '保存',
  CANCEL: '取消',
  // ...
} as const;
```

### 3. 主题系统 (`theme.ts`)

**优势：**
- 设计系统：统一的视觉规范
- 主题切换：支持多主题
- 响应式设计：统一的断点和间距

**示例：**
```typescript
export const COLORS = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    // ...
  },
} as const;
```

### 4. 配置组合 (`appConfig.v2.ts`)

**优势：**
- 模块化：从其他文件导入配置
- 类型安全：使用常量而非字符串
- 易于测试：配置逻辑清晰

## 业界最佳实践

### 1. 配置分层

```
应用配置
├── 环境配置 (development/production)
├── 功能配置 (features/modules)
├── 主题配置 (colors/typography)
└── 文本配置 (i18n/labels)
```

### 2. 常见模式

**Material-UI 方式：**
```typescript
const theme = createTheme({
  palette: { primary: { main: '#1976d2' } },
  typography: { h1: { fontSize: '2rem' } },
});
```

**Ant Design 方式：**
```typescript
const config = {
  token: { colorPrimary: '#1890ff' },
  components: { Button: { colorPrimary: '#1890ff' } },
};
```

**Tailwind CSS 方式：**
```typescript
module.exports = {
  theme: {
    colors: { blue: { 500: '#3b82f6' } },
    spacing: { 4: '1rem' },
  },
};
```

### 3. 类型安全策略

```typescript
// 1. 使用 const assertions
const COLORS = { primary: '#blue' } as const;

// 2. 使用 enum（适合数值）
enum Status { PENDING = 0, COMPLETED = 1 }

// 3. 使用 union types
type Theme = 'light' | 'dark';

// 4. 使用 mapped types
type ButtonVariant = keyof typeof BUTTON_VARIANTS;
```

## 迁移步骤

### 阶段 1：创建新配置文件
1. ✅ 创建 `constants.ts`
2. ✅ 创建 `text.ts`
3. ✅ 创建 `theme.ts`
4. ✅ 创建 `appConfig.v2.ts`

### 阶段 2：逐步迁移组件
1. 更新导入语句
2. 替换硬编码字符串
3. 使用新的常量定义
4. 测试功能完整性

### 阶段 3：清理旧配置
1. 删除 `appConfig.ts`
2. 重命名 `appConfig.v2.ts` 为 `appConfig.ts`
3. 更新所有引用

## 使用示例

### 旧方式（不推荐）
```typescript
// 硬编码，容易出错
const buttonText = '保存';
const componentType = 'prefix';
const color = 'bg-blue-600';
```

### 新方式（推荐）
```typescript
import { BUTTON_TEXTS } from '@/config/text';
import { COMPONENT_TYPES } from '@/config/constants';
import { BUTTON_VARIANTS } from '@/config/theme';

const buttonText = BUTTON_TEXTS.SAVE;
const componentType = COMPONENT_TYPES.PREFIX;
const color = BUTTON_VARIANTS.PRIMARY;
```

## 维护指南

### 添加新功能
1. 在 `constants.ts` 中定义常量
2. 在 `text.ts` 中添加文本
3. 在 `theme.ts` 中定义样式
4. 在 `appConfig.ts` 中组合配置

### 修改文案
- 只需修改 `text.ts` 文件
- 所有使用该文案的地方自动更新

### 调整样式
- 只需修改 `theme.ts` 文件
- 支持主题切换和设计系统

### 国际化支持
- 为每种语言创建对应的 `text.{locale}.ts`
- 根据用户语言动态加载

## 总结

这种配置架构的优势：

1. **可维护性**：模块化设计，职责清晰
2. **类型安全**：TypeScript 类型检查
3. **可扩展性**：易于添加新功能
4. **一致性**：统一的设计系统
5. **国际化**：支持多语言
6. **测试友好**：配置与逻辑分离

这是现代前端应用的标准配置架构，被 Material-UI、Ant Design、Chakra UI 等主流 UI 库广泛采用。
