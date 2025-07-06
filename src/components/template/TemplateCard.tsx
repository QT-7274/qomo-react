import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Download, Star, Users, Calendar, Tag } from 'lucide-react';
import { Template } from '../../types';
import { formatRelativeTime, cn } from '../../utils';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

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
  const getCategoryColor = (category: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' => {
    const colors = {
      general: 'primary' as const,
      creative: 'success' as const,
      technical: 'secondary' as const,
      business: 'warning' as const,
      educational: 'danger' as const,
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
                {template.category}
              </Badge>
              {template.isPublic && (
                <Badge variant="outline" size="sm">
                  公开
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
                title="应用模板"
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
                title="编辑模板"
              />
              <Button
                variant="text"
                size="sm"
                onClick={(e) => {
                  e?.stopPropagation();
                  onDelete(template.id);
                }}
                icon={<Trash2 className="w-3 h-3" />}
                className="delete-btn"
                title="删除模板"
              />
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
                <span>{template.components.length} 个组件</span>
              </div>
            </div>

            {/* Tags */}
            {template.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-2">
                  <Tag className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">标签</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" size="sm" className="text-xs">
                      {tag}
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
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>{template.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{template.usageCount}</span>
              </div>
              <div className="flex items-center gap-1">
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
