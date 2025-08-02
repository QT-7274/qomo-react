/**
 * 国际化演示组件
 * 展示 TemplateCard 组件的国际化效果
 */

import React from 'react';
import { motion } from 'framer-motion';
import TemplateCard from '@/components/template/TemplateCard';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useI18n } from '@/i18n/hooks';
import { mockTemplates } from '@/data/mockData';
import { Template } from '@/types';

const I18nDemo: React.FC = () => {
  const { t, currentLanguage, languagePackage } = useI18n();

  // 使用第一个模板作为演示
  const demoTemplate: Template = mockTemplates[0];

  const handleEdit = (template: Template) => {
    console.log('Edit template:', template.name);
  };

  const handleDelete = (templateId: string) => {
    console.log('Delete template:', templateId);
  };

  const handleApply = (template: Template) => {
    console.log('Apply template:', template.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Qomo - {t('国际化演示')}
              </h1>
              <p className="text-gray-600">
                {t('演示模板卡片组件的国际化功能，点击右侧语言切换器查看效果')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {currentLanguage === 'zh-CN' ? t('当前语言') + ':' : 'Current Language:'}
                <span className="font-medium ml-1">
                  {currentLanguage === 'zh-CN' ? t('简体中文') : 'English (US)'}
                </span>
              </div>
              <LanguageSwitcher size="m" showText={true} />
            </div>
          </div>
        </motion.div>

        {/* Demo Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Template Card Demo */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentLanguage === 'zh-CN' ? t('模板卡片演示') : 'Template Card Demo'}
            </h2>
            <TemplateCard
              template={demoTemplate}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApply={handleApply}
            />
          </div>

          {/* Translation Examples */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentLanguage === 'zh-CN' ? t('翻译示例') : 'Translation Examples'}
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Button Texts */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    {currentLanguage === 'zh-CN' ? t('按钮文本') : 'Button Texts'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">SAVE:</span>
                      <span className="font-medium">{t('保存')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">EDIT:</span>
                      <span className="font-medium">{t('编辑')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">DELETE:</span>
                      <span className="font-medium">{t('删除')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">APPLY:</span>
                      <span className="font-medium">{t('应用')}</span>
                    </div>
                  </div>
                </div>

                {/* Category Labels */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    {currentLanguage === 'zh-CN' ? t('类别标签') : 'Category Labels'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">productivity:</span>
                      <span className="font-medium">{t('效率')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">creative:</span>
                      <span className="font-medium">{t('创意')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">technical:</span>
                      <span className="font-medium">{t('技术')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">business:</span>
                      <span className="font-medium">{t('商务')}</span>
                    </div>
                  </div>
                </div>

                {/* Page Titles */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    {currentLanguage === 'zh-CN' ? t('页面标题') : 'Page Titles'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">EDITOR:</span>
                      <span className="font-medium">{t('模板编辑器')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">LIBRARY:</span>
                      <span className="font-medium">{t('模板库')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">COMPONENTS:</span>
                      <span className="font-medium">{t('组件库')}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    {currentLanguage === 'zh-CN' ? t('统计文本') : 'Statistics Texts'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">COMPONENTS_COUNT:</span>
                      <span className="font-medium">{t('个组件')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">USAGE_COUNT:</span>
                      <span className="font-medium">{t('次使用')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">CREATED_AT:</span>
                      <span className="font-medium">{t('创建时间')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="font-semibold text-blue-900 mb-2">
            {currentLanguage === 'zh-CN' ? t('使用说明') : 'Instructions'}
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>
              {currentLanguage === 'zh-CN' 
                ? `• ${t('点击右上角的语言切换器来切换中英文')}`
                : '• Click the language switcher in the top right to switch between Chinese and English'
              }
            </li>
            <li>
              {currentLanguage === 'zh-CN' 
                ? `• ${t('观察模板卡片中的文本如何根据语言变化')}`
                : '• Observe how the text in the template card changes based on the language'
              }
            </li>
            <li>
              {currentLanguage === 'zh-CN' 
                ? `• ${t('右侧的翻译示例展示了各种文本类别的翻译效果')}`
                : '• The translation examples on the right show the translation effects of various text categories'
              }
            </li>
            <li>
              {currentLanguage === 'zh-CN' 
                ? `• ${t('语言偏好会自动保存到本地存储中')}`
                : '• Language preferences are automatically saved to local storage'
              }
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default I18nDemo;
