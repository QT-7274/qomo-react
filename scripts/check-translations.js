#!/usr/bin/env node

/**
 * 翻译完整性检查工具（简化版）
 * 检查所有语言包是否包含相同的中文键，并检测翻译重复
 *
 * 使用方法：
 * node scripts/check-translations.js
 *
 * 或者在 package.json 中添加脚本：
 * "check-translations": "node scripts/check-translations.js"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  // 语言包目录
  localesDir: path.join(__dirname, '../src/i18n/locales'),

  // 支持的语言
  supportedLanguages: ['zh-CN', 'en-US'],
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

// 从中文语言包中提取所有中文键
function extractChineseKeys() {
  try {
    const filePath = path.join(CONFIG.localesDir, 'zh-CN.ts');
    const content = fs.readFileSync(filePath, 'utf8');

    const keys = new Set();

    // 匹配 '中文': '中文' 格式
    const matches = content.matchAll(/['"`]([^'"`]+)['"`]:\s*['"`]([^'"`]*)['"`]/g);
    for (const match of matches) {
      keys.add(match[1]); // 添加中文键
    }

    return keys;
  } catch (error) {
    log.error(`读取中文语言包失败: ${error.message}`);
    return new Set();
  }
}

// 加载语言包并返回详细信息
function loadLanguagePackageDetails(language) {
  try {
    const filePath = path.join(CONFIG.localesDir, `${language}.ts`);
    const content = fs.readFileSync(filePath, 'utf8');

    // 提取语言包中的所有键值对
    const translations = new Map(); // 中文键 -> 翻译文本
    const translationToKeys = new Map(); // 翻译文本 -> [中文键]

    // 匹配 '中文键': '翻译文本' 格式
    const matches = content.matchAll(/['"`]([^'"`]+)['"`]:\s*['"`]([^'"`]*)['"`]/g);
    for (const match of matches) {
      const chineseKey = match[1]; // 中文键
      const translation = match[2]; // 翻译文本

      translations.set(chineseKey, translation);

      // 记录翻译到键的映射，用于检测重复
      if (!translationToKeys.has(translation)) {
        translationToKeys.set(translation, []);
      }
      translationToKeys.get(translation).push(chineseKey);
    }

    return {
      keys: new Set(translations.keys()),
      translations,
      translationToKeys,
    };
  } catch (error) {
    log.error(`加载语言包 ${language} 失败: ${error.message}`);
    return {
      keys: new Set(),
      translations: new Map(),
      translationToKeys: new Map(),
    };
  }
}

// 检查翻译重复
function checkTranslationDuplicates(languageDetails) {
  const duplicates = [];
  
  for (const [translation, keys] of languageDetails.translationToKeys) {
    if (keys.length > 1) {
      duplicates.push({
        translation,
        keys,
        count: keys.length,
      });
    }
  }
  
  return duplicates;
}

// 检查翻译完整性
function checkTranslationCompleteness() {
  log.title('🔍 翻译完整性和重复检查（简化版）');

  // 1. 从中文语言包中提取所有中文键
  log.info('提取中文键...');
  const chineseKeys = extractChineseKeys();

  if (chineseKeys.size === 0) {
    log.error('未找到任何中文键');
    return false;
  }

  log.success(`找到 ${chineseKeys.size} 个中文键`);
  
  // 2. 检查每个语言包
  const languageDetails = {};
  let hasErrors = false;
  
  for (const language of CONFIG.supportedLanguages) {
    log.info(`检查语言包: ${language}`);
    
    const details = loadLanguagePackageDetails(language);
    languageDetails[language] = details;
    
    if (details.keys.size === 0) {
      log.error(`语言包 ${language} 为空或加载失败`);
      hasErrors = true;
      continue;
    }
    
    log.success(`语言包 ${language} 包含 ${details.keys.size} 个翻译条目`);
  }
  
  // 3. 检查缺失的翻译
  log.info('检查缺失的翻译...');
  
  for (const language of CONFIG.supportedLanguages) {
    const details = languageDetails[language];
    if (!details || details.keys.size === 0) continue;
    
    const missingKeys = [...chineseKeys].filter(key => !details.keys.has(key));
    const extraKeys = [...details.keys].filter(key => !chineseKeys.has(key));
    
    if (missingKeys.length > 0) {
      log.error(`语言包 ${language} 缺失翻译:`);
      missingKeys.forEach(key => {
        console.log(`  ${colors.red}✗${colors.reset} ${key}`);
      });
      hasErrors = true;
    }
    
    if (extraKeys.length > 0) {
      log.warning(`语言包 ${language} 包含额外的中文键:`);
      extraKeys.forEach(key => {
        console.log(`  ${colors.yellow}⚠${colors.reset} ${key}`);
      });
    }
    
    if (missingKeys.length === 0 && extraKeys.length === 0) {
      log.success(`语言包 ${language} 翻译完整`);
    }
  }
  
  // 4. 检查翻译重复
  log.info('检查翻译重复...');
  
  for (const language of CONFIG.supportedLanguages) {
    const details = languageDetails[language];
    if (!details || details.keys.size === 0) continue;
    
    const duplicates = checkTranslationDuplicates(details);
    
    if (duplicates.length > 0) {
      log.warning(`语言包 ${language} 发现重复翻译:`);
      duplicates.forEach(duplicate => {
        console.log(`  ${colors.yellow}⚠${colors.reset} "${duplicate.translation}" 被 ${duplicate.count} 个key使用:`);
        duplicate.keys.forEach(key => {
          console.log(`    - ${key}`);
        });
      });
      hasErrors = true;
    } else {
      log.success(`语言包 ${language} 无重复翻译`);
    }
  }
  
  // 5. 检查语言包之间的一致性
  log.info('检查语言包一致性...');
  
  const languages = Object.keys(languageDetails);
  if (languages.length > 1) {
    const baseLanguage = languages[0];
    const baseKeys = languageDetails[baseLanguage].keys;
    
    for (let i = 1; i < languages.length; i++) {
      const currentLanguage = languages[i];
      const currentKeys = languageDetails[currentLanguage].keys;
      
      const baseArray = [...baseKeys].sort();
      const currentArray = [...currentKeys].sort();
      
      if (baseArray.length !== currentArray.length ||
          !baseArray.every((key, index) => key === currentArray[index])) {
        log.warning(`语言包 ${baseLanguage} 和 ${currentLanguage} 的中文键不一致`);
        hasErrors = true;
      } else {
        log.success(`语言包 ${baseLanguage} 和 ${currentLanguage} 一致`);
      }
    }
  }
  
  // 6. 输出总结
  console.log('\n' + '='.repeat(60));
  
  if (hasErrors) {
    log.error('翻译完整性检查失败');
    console.log(`\n${colors.bright}修复建议：${colors.reset}`);
    console.log('1. 确保所有语言包都包含相同的中文键');
    console.log('2. 在中文语言包中添加缺失的中文键');
    console.log('3. 移除语言包中多余的中文键');
    console.log('4. 检查并修复重复的翻译文本');
    console.log('5. 确保所有语言包的结构保持一致');
    
    process.exit(1);
  } else {
    log.success('翻译完整性检查通过');
    console.log(`\n${colors.bright}统计信息：${colors.reset}`);
    console.log(`• 中文键定义: ${chineseKeys.size} 个`);
    console.log(`• 支持语言: ${CONFIG.supportedLanguages.length} 种`);
    console.log(`• 总翻译条目: ${chineseKeys.size * CONFIG.supportedLanguages.length} 个`);
    console.log(`• 无重复翻译: ✓`);
  }
  
  return !hasErrors;
}

// 主函数
function main() {
  try {
    checkTranslationCompleteness();
  } catch (error) {
    log.error(`检查过程中发生错误: ${error.message}`);
    process.exit(1);
  }
}

// 运行主函数
main();
