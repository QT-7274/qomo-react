import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { Question, QuestionType } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import QuestionCard from './QuestionCard';
// import QuestionEditor from './QuestionEditor';
import { useI18n } from '@/i18n/hooks';

interface QuestionListProps {
  className?: string;
}

const QuestionList: React.FC<QuestionListProps> = ({ className }) => {
  const { t } = useI18n();
  const { questions, deleteQuestion, showNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'complexity'>('date');
  // const [showEditor, setShowEditor] = useState(false);
  // const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Filter and sort questions
  const filteredQuestions = React.useMemo(() => {
    const filtered = questions.filter(question => {
      const matchesSearch = question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === 'all' || question.type === selectedType;
      return matchesSearch && matchesType;
    });

    // Sort questions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        case 'complexity':
          const complexityOrder = { simple: 1, medium: 2, complex: 3 };
          const aComplexity = a.metadata?.complexity || 'simple';
          const bComplexity = b.metadata?.complexity || 'simple';
          return complexityOrder[aComplexity] - complexityOrder[bComplexity];
        default:
          return 0;
      }
    });

    return filtered;
  }, [questions, searchTerm, selectedType, sortBy]);

  const handleEditQuestion = (question: Question) => {
    console.log('Edit question:', question);
    // TODO: Implement question editing
  };

  const handleDeleteQuestion = (questionId: string) => {
    deleteQuestion(questionId);
    showNotification({
      type: 'success',
      title: t('问题已删除'),
      message: t('问题已成功删除'),
      duration: 2000,
    });
  };

  // const handleCloseEditor = () => {
  //   setShowEditor(false);
  //   setEditingQuestion(null);
  // };

  const questionTypes: { value: QuestionType | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: t('全部'), icon: '📋' },
    { value: 'general', label: t('通用'), icon: '💬' },
    { value: 'technical', label: t('技术'), icon: '⚙️' },
    { value: 'creative', label: t('创意'), icon: '🎨' },
    { value: 'analytical', label: t('分析'), icon: '📊' },
    { value: 'research', label: t('研究'), icon: '🔬' },
    { value: 'brainstorm', label: t('头脑风暴'), icon: '💡' },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-800"
        >
          {t('问题库')}
        </motion.h2>
        <Button
          variant="primary"
          onClick={() => console.log('Create new question')}
          icon={<Plus className="w-4 h-4" />}
        >
          {t('新建问题')}
        </Button>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search */}
        <Input
          placeholder={t('搜索问题或标签')}
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
        />

        {/* Type Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">{t('类型')}:</span>
          {questionTypes.map(type => (
            <Badge
              key={type.value}
              variant={selectedType === type.value ? 'primary' : 'outline'}
              className={cn(
                'cursor-pointer transition-all',
                selectedType === type.value ? 'ring-2 ring-blue-300' : 'hover:bg-gray-50'
              )}
              onClick={() => setSelectedType(type.value)}
            >
              <span className="mr-1">{type.icon}</span>
              {type.label}
            </Badge>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">{t('排序')}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">{t('创建时间')}</option>
            <option value="type">{t('问题类型')}</option>
            <option value="complexity">{t('复杂度')}</option>
          </select>
        </div>
      </motion.div>

      {/* Questions Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-gray-600"
      >
        {t('共')} {filteredQuestions.length} {t('个问题')}
        {searchTerm && ` (${t('搜索')}: "${searchTerm}")`}
      </motion.div>

      {/* Questions Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <AnimatePresence>
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <QuestionCard
                question={question}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
                draggable={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredQuestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🤔</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? t('没有找到匹配的问题') : t('还没有问题')}
          </h3>
          <p className="text-white/60 mb-6">
            {searchTerm
              ? t('尝试调整搜索条件或筛选器')
              : t('创建您的第一个问题来开始使用模板系统')
            }
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => console.log('Create new question')}
              icon={<Plus className="w-4 h-4" />}
            >
              {t('创建问题')}
            </Button>
          )}
        </motion.div>
      )}

      {/* Question Editor Modal */}
      {/* <QuestionEditor
        isOpen={showEditor}
        question={editingQuestion}
        onClose={handleCloseEditor}
      /> */}
    </div>
  );
};

export default QuestionList;
