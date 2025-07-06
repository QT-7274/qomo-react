import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Copy, Play, Calendar, Check } from 'lucide-react';
import { Template } from '../../types';
import { formatDate, cn } from '../../utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Textarea } from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Label from '../common/Label';
import { TEMPLATE_CATEGORIES, COMPONENT_DISPLAY_CONFIG, UI_TEXT } from '../../config/appConfig';

interface TemplatePreviewProps {
  template: Template;
  className?: string;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, className }) => {
  const [sampleQuestion, setSampleQuestion] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const generatePrompt = () => {
    let prompt = '';
    
    template.components
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
            if (sampleQuestion.trim()) {
              prompt += sampleQuestion + '\n\n';
            } else if (component.content !== '[用户问题将插入此处]') {
              prompt += component.content + '\n\n';
            } else {
              prompt += '[请在左侧输入示例问题]\n\n';
            }
            break;
        }
      });

    const newPrompt = prompt.trim();

    // 如果生成的提示词发生变化，重置复制状态
    if (newPrompt !== generatedPrompt && copySuccess) {
      setCopySuccess(false);
      setShowFireworks(false);
    }

    setGeneratedPrompt(newPrompt);
  };

  React.useEffect(() => {
    generatePrompt();
  }, [template.components, sampleQuestion]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);

      // 显示成功状态和烟花特效，状态保持到页面刷新
      setCopySuccess(true);
      setShowFireworks(true);

      // 1秒后隐藏烟花特效，但保持复制成功状态
      setTimeout(() => {
        setShowFireworks(false);
      }, 1000);

    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getCategoryColor = (category: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'default' => {
    const config = TEMPLATE_CATEGORIES.find(c => c.key === category);
    return config?.color || 'default';
  };

  const getCategoryLabel = (category: string) => {
    const config = TEMPLATE_CATEGORIES.find(c => c.key === category);
    return config?.label || category;
  };

  // 获取组件类型的中文标签和颜色
  const getComponentTypeInfo = (type: string) => {
    return COMPONENT_DISPLAY_CONFIG[type] || { label: type, variant: 'outline' as const };
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Template Info */}
      <Card variant="default" padding="md">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            模板预览
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {template.name || '未命名模板'}
              </h3>
              {template.description && (
                <p className="text-sm text-gray-600">
                  {template.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={getCategoryColor(template.category)}>
                {getCategoryLabel(template.category)}
              </Badge>
              {template.tags.map(tag => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Stats - 只保留更新时间和组件数量 */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(template.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-center">🧩</span>
                <span>{template.components.length} 组件</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Question Input */}
      <Card variant="default" padding="md">
        <CardContent className="space-y-3">
          <Label className='mb-2'>示例问题 (用于预览)</Label>
          <Textarea
            placeholder="输入一个示例问题来预览最终效果..."
            value={sampleQuestion}
            onChange={(value) => setSampleQuestion(value)}
            rows={3}
            className="resize-none w-full"
          />
        </CardContent>
      </Card>

      {/* Generated Prompt Preview */}
      <Card variant="default" padding="md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Play className="w-5 h-5" />
              生成的提示词
            </CardTitle>
            <div className="flex items-center gap-3 relative">
              {/* 复制成功提示 */}
              <AnimatePresence>
                {copySuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-1 text-green-600 text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    <span>已复制</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 增强烟花特效 */}
              <AnimatePresence>
                {showFireworks && (
                  <div className="absolute -top-4 -right-4 pointer-events-none">
                    {/* 第一层烟花粒子 - 主要爆炸 */}
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={`main-${i}`}
                        initial={{
                          opacity: 1,
                          scale: 0,
                          x: 0,
                          y: 0,
                        }}
                        animate={{
                          opacity: 0,
                          scale: [0, 1.2, 0.8, 0],
                          x: Math.cos((i * Math.PI * 2) / 12) * (25 + Math.random() * 10),
                          y: Math.sin((i * Math.PI * 2) / 12) * (25 + Math.random() * 10),
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1.2,
                          ease: "easeOut",
                          delay: i * 0.02
                        }}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: ['#fbbf24', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'][i % 6],
                          boxShadow: `0 0 8px ${['#fbbf24', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'][i % 6]}`
                        }}
                      />
                    ))}

                    {/* 第二层烟花粒子 - 次要爆炸 */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={`secondary-${i}`}
                        initial={{
                          opacity: 0.8,
                          scale: 0,
                          x: 0,
                          y: 0,
                        }}
                        animate={{
                          opacity: 0,
                          scale: [0, 0.8, 0],
                          x: Math.cos((i * Math.PI * 2) / 8 + Math.PI / 8) * 15,
                          y: Math.sin((i * Math.PI * 2) / 8 + Math.PI / 8) * 15,
                        }}
                        transition={{
                          duration: 0.9,
                          ease: "easeOut",
                          delay: 0.2 + i * 0.03
                        }}
                        className="absolute w-1.5 h-1.5 bg-white rounded-full"
                        style={{
                          boxShadow: '0 0 4px #ffffff'
                        }}
                      />
                    ))}

                    {/* 星星粒子 */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={`star-${i}`}
                        initial={{
                          opacity: 1,
                          scale: 0,
                          x: 0,
                          y: 0,
                          rotate: 0
                        }}
                        animate={{
                          opacity: 0,
                          scale: [0, 1, 0],
                          x: Math.cos((i * Math.PI * 2) / 6) * 35,
                          y: Math.sin((i * Math.PI * 2) / 6) * 35,
                          rotate: 720
                        }}
                        transition={{
                          duration: 1.5,
                          ease: "easeOut",
                          delay: 0.1
                        }}
                        className="absolute text-yellow-400"
                        style={{
                          fontSize: '8px',
                          textShadow: '0 0 4px #fbbf24'
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}

                    {/* 中心闪光 */}
                    <motion.div
                      initial={{ opacity: 1, scale: 0 }}
                      animate={{
                        opacity: [1, 0.8, 0],
                        scale: [0, 2.5, 4]
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut"
                      }}
                      className="absolute w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
                      style={{
                        boxShadow: '0 0 20px #ffffff, 0 0 40px #fbbf24'
                      }}
                    />

                    {/* 光环效果 */}
                    <motion.div
                      initial={{ opacity: 0.6, scale: 0 }}
                      animate={{
                        opacity: 0,
                        scale: 3
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeOut"
                      }}
                      className="absolute w-8 h-8 border-2 border-yellow-300 rounded-full -translate-x-1/2 -translate-y-1/2"
                      style={{
                        boxShadow: '0 0 10px #fbbf24'
                      }}
                    />
                  </div>
                )}
              </AnimatePresence>

              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                icon={copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                disabled={!generatedPrompt}
                htmlType="button"
                className={cn(
                  "transition-all duration-300",
                  copySuccess && "!border-green-500 !text-green-600 !bg-green-50"
                )}
              >
                {copySuccess ? '已复制' : '复制'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className={cn(
              'p-4 rounded-lg border min-h-[200px] max-h-[400px] overflow-y-auto',
              'bg-gray-50 border-gray-300',
              'font-mono text-sm leading-relaxed'
            )}>
              {generatedPrompt ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <pre className="text-gray-800 whitespace-pre-wrap">
                    {generatedPrompt}
                  </pre>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>输入示例问题以查看生成的提示词</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Character count */}
            {generatedPrompt && (
              <div className="mt-2 text-xs text-gray-500 text-right">
                {generatedPrompt.length} 字符
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Component Structure */}
      <Card variant="default" padding="md">
        <CardHeader>
          <CardTitle className="text-gray-800 text-sm">
            组件结构
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {template.components
              .sort((a, b) => a.position - b.position)
              .map((component, index) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                >
                  <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <Badge variant={getComponentTypeInfo(component.type).variant} size="sm">
                        {getComponentTypeInfo(component.type).label}
                      </Badge>
                      {component.isRequired && (
                        <Badge variant="danger" size="sm">
                          必需
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
                      {component.content}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplatePreview;
