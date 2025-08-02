# 国际化系统使用指南

## 概述

本项目实现了完整的国际化（i18n）系统，支持中英文切换，提供编译时检测未翻译文本的功能。

## 功能特性

- ✅ 支持中英文切换
- ✅ 语言偏好持久化存储
- ✅ 类型安全的翻译文本访问
- ✅ 编译时检测未翻译的中文文本
- ✅ 右上角语言切换按钮
- ✅ 动态语言包加载

## 文件结构

```
src/i18n/
├── index.ts           # 核心配置和类型定义
├── hooks.ts           # React Hooks
├── locales/
│   ├── zh-CN.ts      # 中文语言包
│   └── en-US.ts      # 英文语言包
└── README.md         # 本文档
```

## 使用方法

### 1. 基本使用

```tsx
import { useI18n } from '@/i18n/hooks';

function MyComponent() {
  const { languagePackage } = useI18n();
  
  return (
    <div>
      <h1>{languagePackage?.PAGE_TITLES?.EDITOR}</h1>
      <button>{languagePackage?.BUTTON_TEXTS?.SAVE}</button>
    </div>
  );
}
```

### 2. 语言切换

```tsx
import { useLanguageSwitcher } from '@/i18n/hooks';

function LanguageButton() {
  const { currentLanguage, changeLanguage } = useLanguageSwitcher();
  
  const handleSwitch = () => {
    const newLang = currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN';
    changeLanguage(newLang);
  };
  
  return <button onClick={handleSwitch}>切换语言</button>;
}
```

### 3. 分类文本访问

```tsx
import { useCategoryTexts } from '@/i18n/hooks';

function MyComponent() {
  const { buttonText, pageTitle, notification } = useCategoryTexts();
  
  return (
    <div>
      <h1>{pageTitle?.EDITOR}</h1>
      <button>{buttonText?.SAVE}</button>
    </div>
  );
}
```

### 4. 文本格式化

```tsx
import { useTextFormatter } from '@/i18n/hooks';

function MyComponent() {
  const { getFormattedText } = useTextFormatter();
  
  const message = getFormattedText(
    'NOTIFICATIONS.SUCCESS.TEMPLATE_SAVED', 
    { name: 'My Template' }
  );
  
  return <div>{message}</div>;
}
```

## 语言包结构

语言包遵循以下结构：

```typescript
interface LanguagePackage {
  PAGE_TITLES: {
    EDITOR: string;
    LIBRARY: string;
    // ...
  };
  BUTTON_TEXTS: {
    SAVE: string;
    CANCEL: string;
    // ...
  };
  // ... 其他分类
}
```

## 添加新的翻译文本

### 1. 在语言包中添加文本

```typescript
// src/i18n/locales/zh-CN.ts
export default {
  BUTTON_TEXTS: {
    // 现有文本...
    NEW_BUTTON: '新按钮', // 添加新文本
  },
  // ...
};

// src/i18n/locales/en-US.ts
export default {
  BUTTON_TEXTS: {
    // 现有文本...
    NEW_BUTTON: 'New Button', // 添加对应英文
  },
  // ...
};
```

### 2. 更新类型定义

```typescript
// src/i18n/index.ts
export interface LanguagePackage {
  BUTTON_TEXTS: {
    // 现有定义...
    NEW_BUTTON: string; // 添加类型定义
  };
  // ...
}
```

### 3. 在组件中使用

```tsx
function MyComponent() {
  const { languagePackage } = useI18n();
  
  return (
    <button>
      {languagePackage?.BUTTON_TEXTS?.NEW_BUTTON}
    </button>
  );
}
```

## 编译时检测

### 运行检测工具

```bash
# 检测未翻译的中文文本
npm run check-i18n

# 构建前检测
npm run build:check
```

### 检测规则

工具会检测以下情况：
- 直接在JSX中使用的中文文本
- 字符串字面量中的中文
- 未被翻译函数包裹的中文

工具会忽略：
- 注释中的中文
- console输出中的中文
- 已被翻译函数包裹的文本

## 最佳实践

### 1. 统一使用翻译函数

❌ 不推荐：
```tsx
<button>保存</button>
```

✅ 推荐：
```tsx
<button>{languagePackage?.BUTTON_TEXTS?.SAVE}</button>
```

### 2. 提供后备文本

```tsx
<button>
  {languagePackage?.BUTTON_TEXTS?.SAVE || 'Save'}
</button>
```

### 3. 使用语义化的键名

❌ 不推荐：
```typescript
BUTTON_TEXTS: {
  BTN1: '保存',
  BTN2: '取消',
}
```

✅ 推荐：
```typescript
BUTTON_TEXTS: {
  SAVE: '保存',
  CANCEL: '取消',
}
```

### 4. 按功能分组

```typescript
// 按钮相关
BUTTON_TEXTS: { ... },

// 页面标题
PAGE_TITLES: { ... },

// 通知消息
NOTIFICATIONS: { ... },
```

## 故障排除

### 1. 语言包加载失败

检查语言包文件是否存在，路径是否正确：
```
src/i18n/locales/zh-CN.ts
src/i18n/locales/en-US.ts
```

### 2. 翻译文本不显示

1. 检查语言包中是否包含对应的键
2. 检查组件是否正确使用了 useI18n Hook
3. 检查是否提供了后备文本

### 3. 类型错误

确保在 `src/i18n/index.ts` 中的 `LanguagePackage` 接口包含了所有使用的键。

## 开发工具

### 语言切换组件

项目提供了现成的语言切换组件：

```tsx
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

<LanguageSwitcher 
  size="s" 
  showText={true} 
  variant="text" 
/>
```

### 检测脚本

使用检测脚本确保所有中文文本都已国际化：

```bash
npm run check-i18n
```

## 扩展支持

### 添加新语言

1. 创建新的语言包文件：`src/i18n/locales/ja-JP.ts`
2. 在 `SUPPORTED_LANGUAGES` 中添加配置
3. 更新 `SupportedLanguage` 类型定义

### 自定义检测规则

修改 `scripts/check-i18n.js` 中的配置：

```javascript
const CONFIG = {
  // 添加新的忽略模式
  ignorePatterns: [
    // 现有模式...
    /customPattern/g,
  ],
};
```
