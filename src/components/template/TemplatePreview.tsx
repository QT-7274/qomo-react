import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Copy, Play, Calendar } from 'lucide-react';
import { Template } from '../../types';
import { formatDate, cn } from '../../utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Textarea } from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Label from '../common/Label';

interface TemplatePreviewProps {
  template: Template;
  className?: string;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, className }) => {
  const [sampleQuestion, setSampleQuestion] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

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

    setGeneratedPrompt(prompt.trim());
  };

  React.useEffect(() => {
    generatePrompt();
  }, [template.components, sampleQuestion]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      // TODO: Show notification
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getCategoryColor = (category: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'default' => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'default'> = {
      productivity: 'primary',
      creative: 'secondary',
      technical: 'success',
      research: 'warning',
      education: 'danger',
      business: 'outline',
    };
    return colors[category] || 'default';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      productivity: '生产力',
      creative: '创意',
      technical: '技术',
      research: '研究',
      education: '教育',
      business: '商业',
    };
    return labels[category as keyof typeof labels] || category;
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
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              icon={<Copy className="w-4 h-4" />}
              disabled={!generatedPrompt}
            >
              复制
            </Button>
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm">
                        {component.type}
                      </Badge>
                      {component.isRequired && (
                        <Badge variant="danger" size="sm">
                          必需
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {component.content.length > 50
                        ? component.content.substring(0, 50) + '...'
                        : component.content
                      }
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
