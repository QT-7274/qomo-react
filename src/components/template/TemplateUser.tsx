import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Copy, ArrowRight, Wand2 } from 'lucide-react';
import QomoLogo from '@/assets/QomoLogo';
import { useAppStore } from '@/store/useAppStore';
import { Template } from '@/types';
import { cn } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Select } from '@/components/common/TeaSelect';
import TemplatePreview from '@/components/template/TemplatePreview';
import { TEMPLATE_CATEGORIES, UI_TEXT } from '@/config/appConfig';
import { useI18n } from '@/i18n/hooks';

const TemplateUser: React.FC = () => {
  const { templates, showNotification } = useAppStore();
  const { t } = useI18n();
  
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userQuestion, setUserQuestion] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // 过滤模板
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // 分类选项
  const categoryOptions = [
    { value: 'all', text: t('全部分类') },
    ...TEMPLATE_CATEGORIES.map(category => ({
      value: category.key,
      text: t(category.label)
    }))
  ];

  // 生成最终提示词
  const generateFinalPrompt = () => {
    if (!selectedTemplate || !userQuestion.trim()) {
      return '';
    }

    let prompt = '';
    
    selectedTemplate.components
      .sort((a, b) => a.position - b.position)
      .forEach(component => {
        switch (component.type) {
          case 'prefix':
          case 'context':
          case 'constraint':
          case 'example':
          case 'suffix':
            if (component.content.trim()) {
              prompt += component.content + '\n\n';
            }
            break;
          case 'question_slot':
            if (userQuestion.trim()) {
              prompt += userQuestion + '\n\n';
            }
            break;
        }
      });

    return prompt.trim();
  };

  // 当模板或问题改变时重新生成提示词
  useEffect(() => {
    const newPrompt = generateFinalPrompt();
    setGeneratedPrompt(newPrompt);
    
    // 如果生成的提示词发生变化，重置复制状态
    if (newPrompt !== generatedPrompt && copySuccess) {
      setCopySuccess(false);
    }
  }, [selectedTemplate, userQuestion]);

  // 复制提示词
  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopySuccess(true);
      showNotification({
        type: 'success',
        title: t('复制成功'),
        message: t('提示词已复制到剪贴板'),
        duration: 2000,
      });
      
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      showNotification({
        type: 'error',
        title: t('复制失败'),
        message: t('无法复制到剪贴板'),
        duration: 2000,
      });
    }
  };

  // 选择模板
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setUserQuestion(''); // 清空之前的问题
    setGeneratedPrompt(''); // 清空之前的提示词
  };



  return (
    <div className="h-full flex gap-6 p-6">
      {/* Left Panel - Template Selection */}
      <div className="w-1/3 space-y-4">
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              {t('选择模板')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="space-y-3">
                <Input
                  placeholder={t('搜索模板')}
                  value={searchTerm}
                  onChange={(value) => setSearchTerm(value)}
                  size="m"
                />
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value)}
                  size="m"
                  placeholder={t('选择分类')}
                />
              </div>

              {/* Template List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-all duration-200',
                          selectedTemplate?.id === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        )}
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm">
                              {template.name}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" size="sm">
                                {t(TEMPLATE_CATEGORIES.find(c => c.key === template.category)?.label || template.category)}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {template.components.length} {t('个组件')}
                              </span>
                            </div>
                          </div>
                          {selectedTemplate?.id === template.id && (
                            <ArrowRight className="w-4 h-4 text-blue-500 ml-2 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('没有找到匹配的模板')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Template Usage */}
      <div className="flex-1 space-y-4">
        {selectedTemplate ? (
          <>
            {/* Question Input */}
            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {t(UI_TEXT.titles.questionInput)}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {t('输入你的具体问题')}{t('将会替换模板中的')}{'"'}{t('具体问题')}{'"'}{t('组件')}
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={t('请输入你的问题...')}
                  value={userQuestion}
                  onChange={(value) => setUserQuestion(value)}
                  rows={4}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Generated Prompt */}
            <Card variant="default" padding="md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {t('生成的提示词')}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPrompt}
                    icon={copySuccess ? <QomoLogo className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    disabled={!generatedPrompt}
                    className={cn(
                      'transition-all duration-200',
                      copySuccess && 'bg-green-50 border-green-200 text-green-700'
                    )}
                  >
                    {copySuccess ? t('已复制') : t('复制')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {generatedPrompt ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                      {generatedPrompt}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <QomoLogo className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {userQuestion ? t('正在生成提示词...') : t('请输入问题以生成提示词')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Template Preview */}
            <TemplatePreview
              template={selectedTemplate}
            />
          </>
        ) : (
          <Card variant="default" padding="lg">
            <CardContent>
              <div className="text-center py-12">
                <Wand2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {t('选择一个模板开始')}
                </h3>
                <p className="text-gray-500">
                  {t('从左侧选择一个模板')}{t('然后输入你的问题来生成定制化的提示词')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TemplateUser;
