import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus } from 'lucide-react';
import { Question, QuestionType, QuestionMetadata } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { generateId } from '../../utils';
import { Modal, ModalContent, ModalFooter } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface QuestionEditorProps {
  isOpen: boolean;
  question?: Question | null;
  onClose: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  isOpen,
  question,
  onClose,
}) => {
  const { addQuestion, updateQuestion, showNotification } = useAppStore();
  
  const [formData, setFormData] = useState({
    content: '',
    type: 'general' as QuestionType,
    tags: [] as string[],
    domain: '',
    complexity: 'medium' as 'simple' | 'medium' | 'complex',
    expectedLength: 'medium' as 'short' | 'medium' | 'long',
  });
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when question changes
  useEffect(() => {
    if (question) {
      setFormData({
        content: question.content,
        type: question.type,
        tags: [...question.tags],
        domain: question.metadata?.domain || '',
        complexity: question.metadata?.complexity || 'medium',
        expectedLength: question.metadata?.expectedLength || 'medium',
      });
    } else {
      setFormData({
        content: '',
        type: 'general',
        tags: [],
        domain: '',
        complexity: 'medium',
        expectedLength: 'medium',
      });
    }
    setErrors({});
  }, [question, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.content.trim()) {
      newErrors.content = '问题内容不能为空';
    } else if (formData.content.length < 10) {
      newErrors.content = '问题内容至少需要10个字符';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const metadata: QuestionMetadata = {
      complexity: formData.complexity,
      expectedLength: formData.expectedLength,
      domain: formData.domain || undefined,
    };

    if (question) {
      // Update existing question
      updateQuestion(question.id, {
        content: formData.content,
        type: formData.type,
        tags: formData.tags,
        metadata,
        updatedAt: new Date(),
      });
      
      showNotification({
        type: 'success',
        title: '问题已更新',
        message: '问题信息已成功更新',
        duration: 2000,
      });
    } else {
      // Create new question
      const newQuestion: Question = {
        id: generateId(),
        content: formData.content,
        type: formData.type,
        tags: formData.tags,
        metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      addQuestion(newQuestion);
      
      showNotification({
        type: 'success',
        title: '问题已创建',
        message: '新问题已成功添加到问题库',
        duration: 2000,
      });
    }

    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const questionTypes = [
    { value: 'general', label: '通用问题', icon: '💬' },
    { value: 'technical', label: '技术问题', icon: '⚙️' },
    { value: 'creative', label: '创意问题', icon: '🎨' },
    { value: 'analytical', label: '分析问题', icon: '📊' },
    { value: 'research', label: '研究问题', icon: '🔬' },
    { value: 'brainstorm', label: '头脑风暴', icon: '💡' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={question ? '编辑问题' : '创建新问题'}
      description={question ? '修改问题的内容和属性' : '添加一个新的问题到您的问题库'}
      size="lg"
    >
      <ModalContent className="space-y-6">
        {/* Question Content */}
        <div className="space-y-2">
          <Textarea
            label="问题内容"
            placeholder="请输入您的问题..."
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            rows={4}
            className="resize-none"
          />
          {errors.content && (
            <p className="text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Question Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            问题类型
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {questionTypes.map(type => (
              <motion.button
                key={type.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: type.value as QuestionType }))}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  formData.type === type.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-lg mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            标签
          </label>
          
          {/* Add Tag Input */}
          <div className="flex gap-2">
            <Input
              placeholder="添加标签..."
              value={newTag}
              onChange={(value) => setNewTag(value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleAddTag}
              icon={<Plus className="w-4 h-4" />}
              disabled={!newTag.trim()}
            >
              添加
            </Button>
          </div>
          
          {/* Tag List */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge
                  key={tag}
                  variant="primary"
                  removable
                  onRemove={() => handleRemoveTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Domain */}
          <Input
            label="领域 (可选)"
            placeholder="如: 人工智能"
            value={formData.domain}
            onChange={(value) => setFormData(prev => ({ ...prev, domain: value }))}
          />

          {/* Complexity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              复杂度
            </label>
            <select
              value={formData.complexity}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                complexity: e.target.value as 'simple' | 'medium' | 'complex' 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="simple">简单</option>
              <option value="medium">中等</option>
              <option value="complex">复杂</option>
            </select>
          </div>

          {/* Expected Length */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              期望回答长度
            </label>
            <select
              value={formData.expectedLength}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                expectedLength: e.target.value as 'short' | 'medium' | 'long' 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="short">简短</option>
              <option value="medium">中等</option>
              <option value="long">详细</option>
            </select>
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <Button variant="outline" onClick={onClose} icon={<X className="w-4 h-4" />}>
          取消
        </Button>
        <Button variant="primary" onClick={handleSubmit} icon={<Save className="w-4 h-4" />}>
          {question ? '更新问题' : '创建问题'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default QuestionEditor;
