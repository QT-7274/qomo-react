/**
 * ESLint 自定义规则：检测未翻译的中文文本
 * 
 * 这个规则会检查代码中的中文字符串，确保它们被 t() 函数包裹
 * 
 * 使用方法：
 * 1. 在 eslint.config.js 中添加这个规则
 * 2. 配置规则级别：'error', 'warn', 'off'
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '确保中文文本使用 t() 函数进行翻译',
      category: 'Internationalization',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          // 排除的文件模式
          excludeFiles: {
            type: 'array',
            items: { type: 'string' },
            default: ['**/*.test.{js,ts,jsx,tsx}', '**/*.spec.{js,ts,jsx,tsx}'],
          },
          // 排除的函数调用
          excludeFunctions: {
            type: 'array',
            items: { type: 'string' },
            default: ['console.log', 'console.warn', 'console.error', 'console.info'],
          },
          // 排除的对象属性
          excludeProperties: {
            type: 'array',
            items: { type: 'string' },
            default: ['className', 'id', 'key', 'data-*'],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      untranslatedChinese: '中文文本 "{{text}}" 应该使用 t() 函数进行翻译',
      autoFix: '自动修复：将 "{{text}}" 包裹在 t() 函数中',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const excludeFunctions = options.excludeFunctions || ['console.log', 'console.warn', 'console.error', 'console.info'];
    const excludeProperties = options.excludeProperties || ['className', 'id', 'key'];
    
    // 中文字符正则表达式
    const chineseRegex = /[\u4e00-\u9fff]/;
    
    // 检查是否在排除的函数调用中
    function isInExcludedFunction(node) {
      let parent = node.parent;
      while (parent) {
        if (parent.type === 'CallExpression' && parent.callee) {
          const calleeName = getCalleeName(parent.callee);
          if (excludeFunctions.includes(calleeName)) {
            return true;
          }
        }
        parent = parent.parent;
      }
      return false;
    }
    
    // 获取函数调用名称
    function getCalleeName(callee) {
      if (callee.type === 'Identifier') {
        return callee.name;
      }
      if (callee.type === 'MemberExpression') {
        const object = callee.object.name || '';
        const property = callee.property.name || '';
        return `${object}.${property}`;
      }
      return '';
    }
    
    // 检查是否在排除的属性中
    function isInExcludedProperty(node) {
      const parent = node.parent;
      if (parent && parent.type === 'Property' && parent.key) {
        const keyName = parent.key.name || parent.key.value;
        return excludeProperties.some(pattern => {
          if (pattern.endsWith('*')) {
            return keyName.startsWith(pattern.slice(0, -1));
          }
          return keyName === pattern;
        });
      }
      return false;
    }
    
    // 检查是否已经在 t() 函数中
    function isInTFunction(node) {
      let parent = node.parent;
      while (parent) {
        if (parent.type === 'CallExpression' && 
            parent.callee && 
            parent.callee.name === 't') {
          return true;
        }
        parent = parent.parent;
      }
      return false;
    }
    
    // 检查是否在注释中
    function isInComment(node) {
      const sourceCode = context.getSourceCode();
      const comments = sourceCode.getAllComments();
      
      for (const comment of comments) {
        if (node.range[0] >= comment.range[0] && node.range[1] <= comment.range[1]) {
          return true;
        }
      }
      return false;
    }
    
    return {
      Literal(node) {
        // 只检查字符串字面量
        if (typeof node.value !== 'string') {
          return;
        }
        
        // 检查是否包含中文
        if (!chineseRegex.test(node.value)) {
          return;
        }
        
        // 跳过各种排除情况
        if (isInComment(node) ||
            isInExcludedFunction(node) ||
            isInExcludedProperty(node) ||
            isInTFunction(node)) {
          return;
        }
        
        // 报告未翻译的中文文本
        context.report({
          node,
          messageId: 'untranslatedChinese',
          data: {
            text: node.value,
          },
          fix(fixer) {
            // 自动修复：将字符串包裹在 t() 函数中
            const quote = node.raw.charAt(0); // 保持原有的引号类型
            return fixer.replaceText(node, `t(${quote}${node.value}${quote})`);
          },
        });
      },
      
      TemplateLiteral(node) {
        // 检查模板字符串中的中文
        for (const quasi of node.quasis) {
          if (chineseRegex.test(quasi.value.raw)) {
            // 跳过各种排除情况
            if (isInComment(node) ||
                isInExcludedFunction(node) ||
                isInExcludedProperty(node) ||
                isInTFunction(node)) {
              continue;
            }
            
            context.report({
              node: quasi,
              messageId: 'untranslatedChinese',
              data: {
                text: quasi.value.raw,
              },
              // 模板字符串的自动修复比较复杂，暂时不提供
            });
          }
        }
      },
    };
  },
};
