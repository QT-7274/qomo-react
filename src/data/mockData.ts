import { Template, Question } from '@/types';

export const mockTemplates: Template[] = [
  {
    id: 'general-qa',
    name: '通用问答模板',
    description: '适用于大多数日常问题的通用模板',
    category: 'productivity',
    components: [
      {
        id: 'prefix-1',
        type: 'prefix',
        content: '',
        position: 0,
        isRequired: true,
        placeholder: '你是一位RESTful API设计专家。'
      },
      {
        id: 'question-slot-1',
        type: 'question_slot',
        content: '',
        position: 1,
        isRequired: true,
        placeholder: '如何设计订单查询和状态更新的API？'
      },
      {
        id: 'suffix-1',
        type: 'suffix',
        content: '',
        position: 2,
        isRequired: false,
        placeholder: '你需要提供完整的API端点设计和请求/响应示例。'
      }
    ],

    rating: 4.5,
    usageCount: 1250,
    isPublic: true,
    authorId: 'system',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    tags: ['通用', '问答', '基础'],
    version: '1.0.0'
  },
  {
    id: 'creative-writing',
    name: '创意写作助手',
    description: '激发创造力，帮助进行创意写作',
    category: 'creative',
    components: [
      {
        id: 'context-1',
        type: 'context',
        content: '',
        position: 0,
        isRequired: true,
        placeholder: '我需要为电商平台设计订单相关的API。'
      },
      {
        id: 'prefix-2',
        type: 'prefix',
        content: '',
        position: 1,
        isRequired: true,
        placeholder: '你是一位RESTful API设计专家。'
      },
      {
        id: 'question-slot-2',
        type: 'question_slot',
        content: '',
        position: 2,
        isRequired: true,
        placeholder: '如何设计订单查询和状态更新的API？'
      },
      {
        id: 'constraint-1',
        type: 'constraint',
        content: '',
        position: 3,
        isRequired: false,
        placeholder: '你生成的内容必须符合RESTful规范。'
      }
    ],

    rating: 4.8,
    usageCount: 890,
    isPublic: true,
    authorId: 'system',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    tags: ['创意', '写作', '灵感'],
    version: '1.2.0'
  }
];

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    content: '如何提高工作效率？',
    type: 'general',
    tags: ['效率', '工作', '生产力'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    metadata: {
      complexity: 'medium',
      expectedLength: 'medium',
      domain: '职场发展'
    }
  },
  {
    id: 'q2',
    content: '写一个关于未来城市的科幻故事开头',
    type: 'creative',
    tags: ['科幻', '写作', '创意'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    metadata: {
      complexity: 'complex',
      expectedLength: 'long',
      domain: '创意写作'
    }
  },
  {
    id: 'q3',
    content: '解释机器学习中的过拟合现象',
    type: 'technical',
    tags: ['机器学习', '技术', '算法'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    metadata: {
      complexity: 'complex',
      expectedLength: 'medium',
      domain: '人工智能'
    }
  },
  {
    id: 'q4',
    content: '分析当前电商市场的发展趋势',
    type: 'analytical',
    tags: ['电商', '市场分析', '趋势'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    metadata: {
      complexity: 'complex',
      expectedLength: 'long',
      domain: '商业分析'
    }
  }
];
