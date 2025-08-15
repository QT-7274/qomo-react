/**
 * 模板卡片组件
 * 显示模板信息，支持编辑、删除和应用操作，使用国际化和配置化的颜色和文本
 */

import React from 'react';
import { motion } from 'framer-motion';
import { PopConfirm } from 'tea-component';
import { Edit, Trash2, Download, Star, Users, Calendar, Tag } from 'lucide-react';
import { Template } from '@/types';
import { formatRelativeTime } from '@/utils';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useI18n } from '@/i18n/hooks';
import { COLOR_THEMES } from '@/config/constants';

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (templateId: string) => void;
  onApply: (template: Template) => void;
  className?: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
  onApply,
  className
}) => {
  // 使用国际化Hook获取翻译函数
  const { t } = useI18n();

  // 使用配置化的类别颜色映射
  const getCategoryColor = (category: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' => {
    const colors = {
      productivity: 'primary' as const,
      creative: 'success' as const,
      analysis: 'secondary' as const,
      education: 'warning' as const,
      business: 'danger' as const,
      technical: 'outline' as const,
      personal: 'default' as const,
    };
    return colors[category as keyof typeof colors] || 'default';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      general: '💬',
      creative: '🎨',
      technical: '⚙️',
      business: '💼',
      educational: '📚',
    };
    return icons[category as keyof typeof icons] || '📋';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card
        variant="default"
        padding="none"
        hover={true}
        animate={true}
        className="h-full transition-all duration-300 cursor-pointer"
      >
        <CardContent className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCategoryIcon(template.category)}</span>
              <Badge variant={getCategoryColor(template.category)} size="sm">
                {t(template.category === 'productivity' ? t('效率工具') :
                   template.category === 'creative' ? t('创意写作') :
                   template.category === 'research' ? t('分析总结') :
                   template.category === 'education' ? t('教育学习') :
                   template.category === 'business' ? t('商务办公') :
                   template.category === 'technical' ? t('技术开发') : t('效率工具'))}
              </Badge>
              {template.isPublic && (
                <Badge variant="outline" size="sm">
                  {t('公开')}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="text"
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onApply(template);
                }}
                icon={<Download className="w-3 h-3" />}
                className="apply-template-btn"
                title={t('应用')}
              />
              <Button
                variant="text"
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onEdit(template);
                }}
                icon={<Edit className="w-3 h-3" />}
                className="edit-template-btn"
                title={t('编辑')}
              />
              <PopConfirm
                title={`${t('确定要删除模板')}`}
                message={`${t('删除后无法恢复')}，${t('请谨慎操作')}`}
                footer={(close) => (
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={close}>{t('取消')}</Button>
                    <Button
                      variant="primary"
                      onClick={(e) => { e?.stopPropagation(); onDelete(template.id); close(); }}
                      className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                    >
                      {t('确认删除')}
                    </Button>
                  </div>
                )}
              >
                <Button
                  variant="text"
                  size="sm"
                  onClick={(e) => { e?.stopPropagation(); }}
                  icon={<Trash2 className="w-3 h-3" />}
                  className="delete-btn"
                  title={t('删除')}
                />
              </PopConfirm>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {template.name}
            </h3>
            
            {template.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {template.description}
              </p>
            )}

            {/* Components Count */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-4 h-4 text-center">🧩</span>
                <span>
                  {template.components.length} {t('个组件')}
                </span>
              </div>
            </div>

            {/* Tags */}
            {template.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-2">
                  <Tag className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    {t('标签')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" size="sm" className="text-xs">
                      {t(tag)}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" size="sm" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                <span>{template.usageCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>{formatRelativeTime(template.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TemplateCard;
