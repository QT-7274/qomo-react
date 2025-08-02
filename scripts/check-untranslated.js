#!/usr/bin/env node

/**
 * 未翻译文本检查工具
 * 扫描项目中的所有源代码文件，找到未使用 t() 函数包裹的中文文本
 * 
 * 使用方法：
 * node scripts/check-untranslated.js
 * 
 * 或者在 package.json 中添加脚本：
 * "check-untranslated": "node scripts/check-untranslated.js"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  // 源代码目录
  srcDir: path.join(__dirname, '../src'),
  
  // 要扫描的文件扩展名
  fileExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  
  // 排除的目录
  excludeDirs: ['node_modules', '.git', 'dist', 'build'],
  
  // 排除的文件
  excludeFiles: ['vite-env.d.ts'],
  
  // 中文字符正则表达式
  chineseRegex: /[\u4e00-\u9fff]+/g,
  
  // t() 函数调用正则表达式
  tFunctionRegex: /t\s*\(\s*['"`]([^'"`]*[\u4e00-\u9fff][^'"`]*)['"`]\s*\)/g,
  
  // 需要排除的模式（注释、console.log等）
  excludePatterns: [
    /\/\/.*[\u4e00-\u9fff]/g,        // 单行注释
    /\/\*[\s\S]*?\*\//g,            // 多行注释
    /console\.(log|warn|error|info)\s*\([^)]*[\u4e00-\u9fff][^)]*\)/g, // console输出
    /throw\s+new\s+Error\s*\([^)]*[\u4e00-\u9fff][^)]*\)/g, // 错误抛出
    /\.md['"`][\s\S]*?['"`]/g,       // markdown文件内容
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

// 递归获取所有源代码文件
function getAllSourceFiles(dir, files = []) {
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 跳过排除的目录
      if (!CONFIG.excludeDirs.includes(entry)) {
        getAllSourceFiles(fullPath, files);
      }
    } else if (stat.isFile()) {
      // 检查文件扩展名
      const ext = path.extname(entry);
      if (CONFIG.fileExtensions.includes(ext) && !CONFIG.excludeFiles.includes(entry)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// 清理代码内容，移除注释和不需要翻译的部分
function cleanCodeContent(content) {
  let cleanedContent = content;
  
  // 移除排除的模式
  for (const pattern of CONFIG.excludePatterns) {
    cleanedContent = cleanedContent.replace(pattern, '');
  }
  
  return cleanedContent;
}

// 提取文件中的所有中文文本
function extractChineseTexts(content, filePath) {
  const chineseTexts = [];
  const lines = content.split('\n');
  
  lines.forEach((line, lineIndex) => {
    const matches = line.matchAll(CONFIG.chineseRegex);
    for (const match of matches) {
      const chineseText = match[0];
      const columnIndex = match.index;
      
      chineseTexts.push({
        text: chineseText,
        line: lineIndex + 1,
        column: columnIndex + 1,
        fullLine: line.trim(),
        filePath: path.relative(CONFIG.srcDir, filePath),
      });
    }
  });
  
  return chineseTexts;
}

// 提取文件中所有被 t() 函数包裹的中文文本
function extractTranslatedTexts(content) {
  const translatedTexts = new Set();
  const matches = content.matchAll(CONFIG.tFunctionRegex);
  
  for (const match of matches) {
    const translatedText = match[1];
    // 提取其中的中文部分
    const chineseMatches = translatedText.matchAll(CONFIG.chineseRegex);
    for (const chineseMatch of chineseMatches) {
      translatedTexts.add(chineseMatch[0]);
    }
  }
  
  return translatedTexts;
}

// 检查单个文件
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = cleanCodeContent(content);
    
    // 提取所有中文文本
    const allChineseTexts = extractChineseTexts(cleanedContent, filePath);
    
    // 提取已翻译的中文文本
    const translatedTexts = extractTranslatedTexts(content);
    
    // 找出未翻译的文本
    const untranslatedTexts = allChineseTexts.filter(item => {
      // 检查这个中文文本是否在已翻译的集合中
      return !translatedTexts.has(item.text);
    });
    
    return {
      filePath: path.relative(CONFIG.srcDir, filePath),
      totalChinese: allChineseTexts.length,
      translatedCount: allChineseTexts.length - untranslatedTexts.length,
      untranslatedTexts,
    };
  } catch (error) {
    log.error(`读取文件失败 ${filePath}: ${error.message}`);
    return null;
  }
}

// 主检查函数
function checkUntranslatedTexts() {
  log.title('🔍 未翻译文本检查');
  
  // 1. 获取所有源代码文件
  log.info('扫描源代码文件...');
  const sourceFiles = getAllSourceFiles(CONFIG.srcDir);
  
  if (sourceFiles.length === 0) {
    log.error('未找到任何源代码文件');
    return false;
  }
  
  log.success(`找到 ${sourceFiles.length} 个源代码文件`);
  
  // 2. 检查每个文件
  log.info('分析文件中的中文文本...');
  
  const results = [];
  let totalFiles = 0;
  let filesWithUntranslated = 0;
  let totalChineseTexts = 0;
  let totalUntranslatedTexts = 0;
  
  for (const filePath of sourceFiles) {
    const result = checkFile(filePath);
    if (result) {
      results.push(result);
      totalFiles++;
      totalChineseTexts += result.totalChinese;
      totalUntranslatedTexts += result.untranslatedTexts.length;
      
      if (result.untranslatedTexts.length > 0) {
        filesWithUntranslated++;
      }
    }
  }
  
  // 3. 输出结果
  console.log('\n' + '='.repeat(80));
  log.title('📊 检查结果');
  
  if (totalUntranslatedTexts === 0) {
    log.success('所有中文文本都已正确翻译！');
  } else {
    log.warning(`发现 ${totalUntranslatedTexts} 个未翻译的中文文本`);
    
    console.log(`\n${colors.bright}未翻译文本详情：${colors.reset}\n`);
    
    for (const result of results) {
      if (result.untranslatedTexts.length > 0) {
        console.log(`${colors.cyan}📁 ${result.filePath}${colors.reset}`);
        console.log(`   翻译进度: ${result.translatedCount}/${result.totalChinese} (${Math.round(result.translatedCount / result.totalChinese * 100)}%)`);
        
        result.untranslatedTexts.forEach(item => {
          console.log(`   ${colors.red}✗${colors.reset} 第${item.line}行: "${colors.yellow}${item.text}${colors.reset}"`);
          console.log(`     ${colors.gray}${item.fullLine}${colors.reset}`);
        });
        console.log('');
      }
    }
  }
  
  // 4. 输出统计信息
  console.log('='.repeat(80));
  console.log(`\n${colors.bright}统计信息：${colors.reset}`);
  console.log(`• 扫描文件: ${totalFiles} 个`);
  console.log(`• 包含中文的文件: ${results.filter(r => r.totalChinese > 0).length} 个`);
  console.log(`• 有未翻译文本的文件: ${filesWithUntranslated} 个`);
  console.log(`• 中文文本总数: ${totalChineseTexts} 个`);
  console.log(`• 已翻译: ${totalChineseTexts - totalUntranslatedTexts} 个`);
  console.log(`• 未翻译: ${totalUntranslatedTexts} 个`);
  console.log(`• 翻译完成度: ${totalChineseTexts > 0 ? Math.round((totalChineseTexts - totalUntranslatedTexts) / totalChineseTexts * 100) : 100}%`);
  
  if (totalUntranslatedTexts > 0) {
    console.log(`\n${colors.bright}修复建议：${colors.reset}`);
    console.log('1. 将未翻译的中文文本用 t() 函数包裹');
    console.log('   例如：将 "保存" 改为 t("保存")');
    console.log('2. 确保在语言包中添加对应的翻译');
    console.log('   zh-CN.ts: "保存": "保存"');
    console.log('   en-US.ts: "保存": "Save"');
    console.log('3. 运行 npm run check-translations 验证翻译完整性');
    console.log('4. 可以使用 npm run check-all-i18n 进行完整检查');

    console.log(`\n${colors.bright}快速修复脚本：${colors.reset}`);
    console.log('可以考虑创建一个自动修复脚本来批量处理这些未翻译的文本');

    process.exit(1);
  }
  
  return totalUntranslatedTexts === 0;
}

// 主函数
function main() {
  try {
    checkUntranslatedTexts();
  } catch (error) {
    log.error(`检查过程中发生错误: ${error.message}`);
    process.exit(1);
  }
}

// 运行主函数
main();
