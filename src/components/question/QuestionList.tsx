import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { Question, QuestionType } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils';
import { Input } from '../ui/Input';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import QuestionCard from './QuestionCard';
// import QuestionEditor from './QuestionEditor';

interface QuestionListProps {
  className?: string;
}

const QuestionList: React.FC<QuestionListProps> = ({ className }) => {
  const { questions, deleteQuestion, showNotification } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'complexity'>('date');
  // const [showEditor, setShowEditor] = useState(false);
  // const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Filter and sort questions
  const filteredQuestions = React.useMemo(() => {
    let filtered = questions.filter(question => {
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
      title: '问题已删除',
      message: '问题已成功删除',
      duration: 2000,
    });
  };

  // const handleCloseEditor = () => {
  //   setShowEditor(false);
  //   setEditingQuestion(null);
  // };

  const questionTypes: { value: QuestionType | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: '全部', icon: '📋' },
    { value: 'general', label: '通用', icon: '💬' },
    { value: 'technical', label: '技术', icon: '⚙️' },
    { value: 'creative', label: '创意', icon: '🎨' },
    { value: 'analytical', label: '分析', icon: '📊' },
    { value: 'research', label: '研究', icon: '🔬' },
    { value: 'brainstorm', label: '头脑风暴', icon: '💡' },
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
          问题库
        </motion.h2>
        <Button
          variant="primary"
          onClick={() => console.log('Create new question')}
          icon={<Plus className="w-4 h-4" />}
        >
          新建问题
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
          placeholder="搜索问题或标签..."
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
        />

        {/* Type Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">类型:</span>
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
          <span className="text-sm text-gray-600">排序:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">创建时间</option>
            <option value="type">问题类型</option>
            <option value="complexity">复杂度</option>
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
        共 {filteredQuestions.length} 个问题
        {searchTerm && ` (搜索: "${searchTerm}")`}
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
            {searchTerm ? '没有找到匹配的问题' : '还没有问题'}
          </h3>
          <p className="text-white/60 mb-6">
            {searchTerm 
              ? '尝试调整搜索条件或筛选器' 
              : '创建您的第一个问题来开始使用模板系统'
            }
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => console.log('Create new question')}
              icon={<Plus className="w-4 h-4" />}
            >
              创建问题
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
