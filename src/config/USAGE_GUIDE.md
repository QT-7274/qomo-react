# 配置系统使用指南

## 概述

本项目采用模块化的配置架构，将常量、文本、主题等配置分离到不同文件中，提高代码的可维护性和类型安全性。

## 配置文件结构

```
src/config/
├── constants.ts      # 常量定义（路由、图标、枚举等）
├── text.ts          # 文本内容（按钮、标签、消息等）
├── theme.ts         # 主题配置（颜色、样式、间距等）
├── navigation.ts    # 导航配置（菜单项、页面信息等）
├── appConfig.ts     # 原有配置（逐步迁移中）
├── appConfig.v2.ts  # 新配置示例
└── README.md        # 架构指南
```

## 使用方法

### 1. 导入配置

```typescript
// 导入常量
import { ROUTES, COMPONENT_TYPES, COLOR_THEMES } from '@/config/constants';

// 导入文本
import { BUTTON_TEXTS, NOTIFICATIONS, PLACEHOLDERS } from '@/config/text';

// 导入主题
import { COMPONENT_COLORS, BUTTON_VARIANTS } from '@/config/theme';

// 导入导航配置
import { MAIN_NAVIGATION, getPageInfo } from '@/config/navigation';
```

### 2. 使用常量

```typescript
// ✅ 推荐：使用常量
const navigateToEditor = () => {
  navigate(`${ROUTES.EDITOR}?mode=${EDITOR_MODES.CREATE}`);
};

// ❌ 避免：硬编码
const navigateToEditor = () => {
  navigate('/editor?mode=create');
};
```

### 3. 使用文本配置

```typescript
// ✅ 推荐：使用配置化文本
<Button>{BUTTON_TEXTS.SAVE}</Button>
<Input placeholder={PLACEHOLDERS.TEMPLATE_NAME} />

// ❌ 避免：硬编码文本
<Button>保存</Button>
<Input placeholder="请输入模板名称..." />
```

### 4. 使用主题配置

```typescript
// ✅ 推荐：使用主题配置
const buttonClass = BUTTON_VARIANTS.PRIMARY;
const componentColor = COMPONENT_COLORS[COLOR_THEMES.SUCCESS];

// ❌ 避免：硬编码样式
const buttonClass = 'bg-blue-600 text-white hover:bg-blue-700';
```

### 5. 使用导航配置

```typescript
// ✅ 推荐：使用配置化导航
{MAIN_NAVIGATION.map((item) => (
  <NavLink
    key={item.id}
    path={item.path}
    label={item.label}
    icon={getIcon(item.icon)}
    color={item.color}
  />
))}

// ❌ 避免：硬编码导航
<NavLink path="/editor" label="模板工作台" icon={Wand2} color="primary" />
```

## 最佳实践

### 1. 添加新配置

当需要添加新的配置项时：

1. **确定配置类型**：常量、文本、主题还是导航？
2. **选择合适文件**：根据配置类型选择对应的配置文件
3. **添加类型定义**：确保类型安全
4. **更新导出**：在文件末尾导出新的类型

```typescript
// constants.ts
export const NEW_FEATURE_TYPES = {
  TYPE_A: 'type_a',
  TYPE_B: 'type_b',
} as const;

export type NewFeatureType = typeof NEW_FEATURE_TYPES[keyof typeof NEW_FEATURE_TYPES];
```

### 2. 修改现有配置

修改配置时只需要在对应的配置文件中修改，所有使用该配置的地方会自动更新：

```typescript
// text.ts - 修改按钮文本
export const BUTTON_TEXTS = {
  SAVE: '保存模板', // 从 '保存' 改为 '保存模板'
  // ...
} as const;
```

### 3. 国际化准备

为支持多语言，可以创建语言特定的文本文件：

```typescript
// text.en.ts - 英文文本
export const BUTTON_TEXTS = {
  SAVE: 'Save',
  CANCEL: 'Cancel',
  // ...
} as const;

// text.zh.ts - 中文文本
export const BUTTON_TEXTS = {
  SAVE: '保存',
  CANCEL: '取消',
  // ...
} as const;
```

### 4. 主题切换

主题配置支持动态切换：

```typescript
// 定义多个主题
const THEMES = {
  light: {
    primary: '#3b82f6',
    background: '#ffffff',
  },
  dark: {
    primary: '#60a5fa',
    background: '#1f2937',
  },
} as const;

// 动态应用主题
const currentTheme = THEMES[userPreference];
```

## 迁移指南

### 从硬编码到配置化

1. **识别硬编码**：查找组件中的字符串字面量
2. **分类配置**：确定是常量、文本还是样式
3. **添加到配置**：在对应配置文件中添加
4. **替换引用**：在组件中使用配置
5. **测试验证**：确保功能正常

### 示例迁移

```typescript
// 迁移前
const handleSave = () => {
  navigate('/editor?mode=create');
  showNotification({
    type: 'success',
    title: '保存成功',
    message: '模板已保存',
  });
};

// 迁移后
const handleSave = () => {
  navigate(`${ROUTES.EDITOR}?mode=${EDITOR_MODES.CREATE}`);
  showNotification({
    type: 'success',
    title: NOTIFICATIONS.SUCCESS.TEMPLATE_SAVED,
    message: NOTIFICATIONS.SUCCESS.TEMPLATE_SAVED,
  });
};
```

## 注意事项

1. **类型安全**：始终使用 `as const` 确保类型推断
2. **命名规范**：使用大写字母和下划线的常量命名
3. **分组组织**：相关配置放在同一个对象中
4. **文档注释**：为复杂配置添加注释说明
5. **向后兼容**：迁移时保持 API 兼容性

## 工具支持

- **IDE 自动补全**：TypeScript 提供完整的类型提示
- **类型检查**：编译时发现配置错误
- **重构支持**：IDE 支持安全重命名和查找引用
- **导入优化**：自动移除未使用的导入

通过遵循这些指南，可以充分利用配置系统的优势，提高代码质量和开发效率。
