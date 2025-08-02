#!/usr/bin/env node

/**
 * 国际化检测工具
 * 检测项目中未被翻译标签包裹的中文文本
 *
 * 使用方法：
 * node scripts/check-i18n.js
 *
 * 或者在 package.json 中添加脚本：
 * "check-i18n": "node scripts/check-i18n.js"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  // 需要检查的文件扩展名
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  
  // 需要检查的目录
  includeDirs: ['src'],
  
  // 需要排除的目录和文件
  excludeDirs: ['node_modules', 'build', 'dist', '.git'],
  excludeFiles: [
    'src/i18n', // 排除国际化相关文件
    'src/config/text.ts', // 排除原有的文本配置文件
    'scripts', // 排除脚本文件
  ],
  
  // 中文字符正则表达式
  chineseRegex: /[\u4e00-\u9fff]+/g,
  
  // 需要忽略的模式（已经被翻译函数包裹的）
  ignorePatterns: [
    /t\(['"`].*?['"`]\)/g, // t('text') 或 t("text") 或 t(`text`)
    /languagePackage\?\..*?/g, // languagePackage?.BUTTON_TEXTS.SAVE
    /\w+Text\.\w+/g, // buttonText.SAVE, pageTitle.EDITOR 等
    /BUTTON_TEXTS\.\w+/g, // 配置文件中的常量引用
    /PAGE_TITLES\.\w+/g,
    /LABELS\.\w+/g,
    /PLACEHOLDERS\.\w+/g,
    /NOTIFICATIONS\.\w+/g,
    /\/\*[\s\S]*?\*\//g, // 多行注释
    /\/\/.*$/gm, // 单行注释
    /console\.(log|error|warn|info)\(.*?\)/g, // console 输出
    /aria-label=['"`].*?['"`]/g, // aria-label 属性
  ],
};

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bright: '\x1b[1m',
};

// 日志函数
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// 检查文件是否应该被排除
function shouldExcludeFile(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // 检查是否在排除目录中
  for (const excludeDir of CONFIG.excludeDirs) {
    if (normalizedPath.includes(`/${excludeDir}/`) || normalizedPath.startsWith(`${excludeDir}/`)) {
      return true;
    }
  }
  
  // 检查是否在排除文件列表中
  for (const excludeFile of CONFIG.excludeFiles) {
    if (normalizedPath.includes(excludeFile)) {
      return true;
    }
  }
  
  return false;
}

// 获取所有需要检查的文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!shouldExcludeFile(filePath)) {
        getAllFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (CONFIG.extensions.includes(ext) && !shouldExcludeFile(filePath)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// 清理代码内容，移除注释和已翻译的部分
function cleanContent(content) {
  let cleaned = content;
  
  // 移除所有忽略的模式
  CONFIG.ignorePatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  return cleaned;
}

// 检查单个文件
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = cleanContent(content);
    const lines = content.split('\n');
    const issues = [];
    
    // 查找中文字符
    const matches = [...cleanedContent.matchAll(CONFIG.chineseRegex)];
    
    matches.forEach(match => {
      const chineseText = match[0];
      const index = match.index;
      
      // 找到对应的行号
      let lineNumber = 1;
      let currentIndex = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (currentIndex + lines[i].length >= index) {
          lineNumber = i + 1;
          break;
        }
        currentIndex += lines[i].length + 1; // +1 for newline
      }
      
      // 获取上下文
      const line = lines[lineNumber - 1];
      const columnNumber = index - currentIndex + line.length;
      
      issues.push({
        text: chineseText,
        line: lineNumber,
        column: columnNumber,
        context: line.trim(),
      });
    });
    
    return issues;
  } catch (error) {
    log.error(`读取文件失败: ${filePath} - ${error.message}`);
    return [];
  }
}

// 主函数
function main() {
  log.title('🌐 国际化检测工具');
  
  log.info('开始扫描项目文件...');
  
  const allFiles = [];
  CONFIG.includeDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      getAllFiles(dir, allFiles);
    }
  });
  
  log.info(`找到 ${allFiles.length} 个文件需要检查`);
  
  const allIssues = [];
  let checkedFiles = 0;
  
  allFiles.forEach(filePath => {
    const issues = checkFile(filePath);
    if (issues.length > 0) {
      allIssues.push({
        file: filePath,
        issues: issues,
      });
    }
    checkedFiles++;
  });
  
  // 输出结果
  console.log('\n' + '='.repeat(60));
  
  if (allIssues.length === 0) {
    log.success(`检查完成！未发现未翻译的中文文本。`);
    log.info(`共检查了 ${checkedFiles} 个文件。`);
  } else {
    log.warning(`发现 ${allIssues.length} 个文件包含未翻译的中文文本：`);
    
    allIssues.forEach(({ file, issues }) => {
      console.log(`\n${colors.bright}${file}${colors.reset}`);
      issues.forEach(issue => {
        console.log(`  ${colors.red}${issue.line}:${issue.column}${colors.reset} - "${colors.yellow}${issue.text}${colors.reset}"`);
        console.log(`    ${colors.cyan}${issue.context}${colors.reset}`);
      });
    });
    
    console.log(`\n${colors.bright}总计：${colors.reset}`);
    const totalIssues = allIssues.reduce((sum, item) => sum + item.issues.length, 0);
    log.warning(`${allIssues.length} 个文件，${totalIssues} 处未翻译的中文文本`);
    
    console.log(`\n${colors.bright}建议：${colors.reset}`);
    console.log('1. 使用 useI18n() hook 获取翻译函数');
    console.log('2. 将硬编码的中文文本替换为 languagePackage?.CATEGORY.KEY 的形式');
    console.log('3. 在语言包中添加对应的翻译文本');
    
    process.exit(1);
  }
}

// 运行主函数
main();

export {
  checkFile,
  getAllFiles,
  CONFIG,
};
