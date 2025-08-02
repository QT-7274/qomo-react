# 未翻译文本检测方案

## 🎯 问题背景

在国际化项目开发中，经常会遇到以下问题：
- ❌ 开发者忘记使用 `t()` 函数包裹中文文本
- ❌ 新增的中文文本没有及时翻译
- ❌ 无法在编译时发现未翻译的文本
- ❌ 缺乏自动化检测机制

## 🔍 解决方案

我们提供了**三种检测方式**来确保所有中文文本都被正确翻译：

### 1. 静态代码分析工具

**检查脚本** (`scripts/check-untranslated.js`):
```bash
npm run check-untranslated
```

**功能特性**：
- ✅ 扫描所有源代码文件（.tsx, .ts, .jsx, .js）
- ✅ 检测未使用 `t()` 函数包裹的中文文本
- ✅ 排除注释、console.log 等不需要翻译的场景
- ✅ 提供详细的文件位置和行号信息
- ✅ 统计翻译完成度

**输出示例**：
```
🔍 未翻译文本检查

⚠ 发现 737 个未翻译的中文文本

📁 components/template/TemplateCard.tsx
   翻译进度: 6/13 (46%)
   ✗ 第78行: "效率工具"
     {t(template.category === 'productivity' ? '效率工具' :

统计信息：
• 扫描文件: 49 个
• 包含中文的文件: 27 个
• 有未翻译文本的文件: 26 个
• 中文文本总数: 749 个
• 已翻译: 12 个
• 未翻译: 737 个
• 翻译完成度: 2%
```

### 2. ESLint 规则（编译时检查）

**自定义规则** (`eslint-rules/no-untranslated-chinese.js`):

**配置方式**：
```javascript
// eslint.config.js
import noUntranslatedChinese from './eslint-rules/no-untranslated-chinese.js';

export default [
  {
    plugins: {
      'custom': {
        rules: {
          'no-untranslated-chinese': noUntranslatedChinese,
        },
      },
    },
    rules: {
      'custom/no-untranslated-chinese': 'error', // 或 'warn'
    },
  },
];
```

**功能特性**：
- ✅ 实时检测未翻译的中文文本
- ✅ 在IDE中显示错误提示
- ✅ 支持自动修复（将文本包裹在 t() 函数中）
- ✅ 可配置排除规则
- ✅ 集成到构建流程中

### 3. 完整的检查流程

**综合检查命令**：
```bash
npm run check-all-i18n
```

这个命令会依次运行：
1. `check-untranslated` - 检测未翻译文本
2. `check-translations` - 检查翻译完整性
3. `check-i18n` - 检查国际化配置

## 🛠️ 使用方式

### 1. 开发阶段

**实时检测**：
- ESLint 规则会在编码时实时提示
- IDE 会显示红色波浪线标记未翻译文本

**手动检查**：
```bash
# 检查未翻译文本
npm run check-untranslated

# 完整国际化检查
npm run check-all-i18n
```

### 2. 构建阶段

**集成到构建流程**：
```json
{
  "scripts": {
    "build:check": "npm run check-all-i18n && npm run build"
  }
}
```

**CI/CD 集成**：
```yaml
# GitHub Actions 示例
- name: Check Internationalization
  run: npm run check-all-i18n

- name: Build
  run: npm run build
```

## 📊 检测规则

### 包含的检测场景
- ✅ JSX 中的中文文本：`<div>保存</div>`
- ✅ 字符串字面量：`const text = '删除';`
- ✅ 对象属性值：`{ label: '编辑' }`
- ✅ 函数参数：`showMessage('操作成功')`
- ✅ 模板字符串：`` `共${count}个组件` ``

### 排除的检测场景
- ❌ 注释中的中文：`// 这是注释`
- ❌ console 输出：`console.log('调试信息')`
- ❌ 已翻译文本：`t('保存')`
- ❌ CSS 类名：`className="中文类名"`
- ❌ 测试文件：`*.test.js`, `*.spec.js`

## 🔧 配置选项

### ESLint 规则配置

```javascript
{
  rules: {
    'custom/no-untranslated-chinese': ['error', {
      // 排除的文件模式
      excludeFiles: [
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.spec.{js,ts,jsx,tsx}',
      ],
      
      // 排除的函数调用
      excludeFunctions: [
        'console.log',
        'console.warn', 
        'console.error',
        'console.info',
      ],
      
      // 排除的对象属性
      excludeProperties: [
        'className',
        'id', 
        'key',
        'data-*',
      ],
    }],
  },
}
```

### 静态检查工具配置

```javascript
// scripts/check-untranslated.js 中的配置
const CONFIG = {
  // 要扫描的文件扩展名
  fileExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  
  // 排除的目录
  excludeDirs: ['node_modules', '.git', 'dist', 'build'],
  
  // 排除的文件
  excludeFiles: ['vite-env.d.ts'],
  
  // 需要排除的模式
  excludePatterns: [
    /\/\/.*[\u4e00-\u9fff]/g,        // 单行注释
    /\/\*[\s\S]*?\*\//g,            // 多行注释
    /console\.(log|warn|error|info)/g, // console输出
  ],
};
```

## 🚀 修复建议

### 1. 批量修复

对于大量未翻译文本，可以：

**使用 ESLint 自动修复**：
```bash
npx eslint --fix src/
```

**手动修复示例**：
```typescript
// 修复前
const message = '保存成功';
<Button>删除</Button>

// 修复后  
const message = t('保存成功');
<Button>{t('删除')}</Button>
```

### 2. 添加到语言包

```typescript
// zh-CN.ts
const zhCN = {
  '保存成功': '保存成功',
  '删除': '删除',
  // ...
};

// en-US.ts  
const enUS = {
  '保存成功': 'Save Success',
  '删除': 'Delete',
  // ...
};
```

### 3. 验证修复结果

```bash
# 检查修复后的结果
npm run check-untranslated

# 验证翻译完整性
npm run check-translations

# 完整检查
npm run check-all-i18n
```

## 📈 最佳实践

### 1. 开发流程
1. **编码时**：依赖 ESLint 规则实时提示
2. **提交前**：运行 `npm run check-untranslated`
3. **构建前**：运行 `npm run check-all-i18n`

### 2. 团队协作
- 在 pre-commit hook 中添加检查
- 在 CI/CD 中集成检查流程
- 定期运行完整检查报告

### 3. 渐进式修复
- 优先修复核心功能模块
- 按文件或组件逐步修复
- 设置翻译完成度目标

## 🎉 总结

通过这套完整的未翻译文本检测方案，我们实现了：

1. **✅ 实时检测**：ESLint 规则在编码时提供即时反馈
2. **✅ 静态分析**：专门的检查工具提供详细报告
3. **✅ 自动修复**：支持批量自动修复常见问题
4. **✅ 集成友好**：可以轻松集成到现有开发流程
5. **✅ 可配置性**：支持灵活的排除规则和配置选项

这个方案确保了项目中的所有中文文本都能被正确翻译，大大提高了国际化的质量和效率！🌍
