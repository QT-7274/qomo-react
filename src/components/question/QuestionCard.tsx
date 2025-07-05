import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Edit, Trash2, Tag, Clock } from 'lucide-react';
import { Question } from '../../types';
import { formatRelativeTime, cn } from '../../utils';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface QuestionCardProps {
  question: Question;
  onEdit?: (question: Question) => void;
  onDelete?: (questionId: string) => void;
  draggable?: boolean;
  className?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onEdit,
  onDelete,
  draggable = true,
  className,
}) => {
  // Temporarily disable drag functionality
  const isDragging = false;

  const getTypeColor = (type: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' => {
    const colors = {
      general: 'primary' as const,
      technical: 'secondary' as const,
      creative: 'success' as const,
      analytical: 'warning' as const,
      research: 'danger' as const,
      brainstorm: 'outline' as const,
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      general: '💬',
      technical: '⚙️',
      creative: '🎨',
      analytical: '📊',
      research: '🔬',
      brainstorm: '💡',
    };
    return icons[type as keyof typeof icons] || '❓';
  };

  const getComplexityColor = (complexity: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' => {
    const colors = {
      simple: 'success' as const,
      medium: 'warning' as const,
      complex: 'danger' as const,
    };
    return colors[complexity as keyof typeof colors] || 'default';
  };

  return (
    <div>
      <Card
        variant="default"
        padding="none"
        hover={!isDragging}
        animate={!isDragging}
        className={cn(
          'transition-all duration-300 cursor-pointer',
          isDragging && 'opacity-50 rotate-2 scale-105',
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            {draggable && (
              <div className="mt-1 p-1 rounded hover:bg-white/20 cursor-grab active:cursor-grabbing transition-colors">
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(question.type)}</span>
                  <Badge variant={getTypeColor(question.type)} size="sm">
                    {question.type}
                  </Badge>
                  {question.metadata?.complexity && (
                    <Badge variant={getComplexityColor(question.metadata.complexity)} size="sm">
                      {question.metadata.complexity}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(question)}
                      icon={<Edit className="w-3 h-3" />}
                      className="p-1.5 hover:bg-white/20"
                    />
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(question.id)}
                      icon={<Trash2 className="w-3 h-3" />}
                      className="p-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                    />
                  )}
                </div>
              </div>

              {/* Question Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-gray-800 font-medium leading-relaxed">
                  {question.content}
                </p>
              </motion.div>

              {/* Tags */}
              {question.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 flex-wrap"
                >
                  <Tag className="w-3 h-3 text-gray-500" />
                  {question.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </motion.div>
              )}

              {/* Metadata */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between text-xs text-gray-500"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(question.createdAt)}</span>
                  </div>
                  {question.metadata?.domain && (
                    <div className="flex items-center gap-1">
                      <span>领域: {question.metadata.domain}</span>
                    </div>
                  )}
                </div>
                {question.metadata?.expectedLength && (
                  <Badge variant="outline" size="sm">
                    {question.metadata.expectedLength} 回答
                  </Badge>
                )}
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionCard;
