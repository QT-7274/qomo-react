# EdgeOne Pages 集成指南

## 📋 概述

本文档介绍如何将 Qomo 项目集成到腾讯云 EdgeOne Pages，利用边缘函数和 KV 存储实现云端模板同步功能。

## 🏗️ 架构设计

### 核心功能
1. **KV 存储**：用于存储用户模板和公开模板
2. **边缘函数**：提供 API 接口处理模板的增删改查
3. **AI 优化**：利用边缘计算优化提示词（预留功能）

### 文件结构
```
functions/
├── api/
│   ├── templates/
│   │   ├── save.js      # 保存模板
│   │   ├── list.js      # 获取模板列表
│   │   └── delete.js    # 删除模板
│   ├── kv/
│   │   └── [action].js  # KV 存储通用操作
│   └── ai/
│       └── optimize.js  # AI 优化功能（预留）
src/
├── hooks/
│   ├── useEdgeCloudSync.ts  # 云端同步 Hook
│   └── useAIOptimize.ts     # AI 优化 Hook（预留）
└── utils/
    └── edgeKvStorage.ts     # KV 存储工具类
```

## ⚙️ EdgeOne Pages 配置

### 1. 环境变量配置

在 EdgeOne Pages 控制台中配置以下环境变量：

```bash
# KV 存储命名空间（变量名为 qomo）
qomo=your-kv-namespace-id

# AI 服务配置（可选）
AI_API_KEY=your-ai-api-key
AI_API_ENDPOINT=your-ai-endpoint
```

### 2. KV 存储配置

1. 在 EdgeOne Pages 控制台创建 KV 命名空间
2. 命名空间名称：`qomo-templates`
3. 将命名空间 ID 配置到环境变量 `qomo`

### 3. 路由配置

EdgeOne Pages 会自动根据 `functions` 目录结构生成路由：

```
/api/templates/save    → functions/api/templates/save.js
/api/templates/list    → functions/api/templates/list.js
/api/templates/delete  → functions/api/templates/delete.js
/api/kv/put           → functions/api/kv/[action].js
/api/kv/get           → functions/api/kv/[action].js
/api/ai/optimize      → functions/api/ai/optimize.js
/api/test/kv          → functions/api/test/kv.js
/api/test/counter     → functions/api/test/counter.js
```

### 4. 测试接口

为了验证 KV 存储是否正常工作，我们提供了两个测试接口：

#### 4.1 KV 存储功能测试
```
GET /api/test/kv
```
测试 KV 存储的基本增删改查功能。

#### 4.2 访问计数器测试
```
GET /api/test/counter
```
简单的访问计数器，完全按照官方示例格式编写。

## 🔑 KV 存储数据结构

### 用户模板存储
```
键名格式：template:{userId}:{templateId}
值：JSON 格式的模板数据
元数据：{
  userId: string,
  templateName: string,
  category: string,
  isPublic: boolean,
  createdAt: string
}
```

### 公开模板存储
```
键名格式：public:template:{templateId}
值：JSON 格式的模板数据
元数据：{
  author: string,
  category: string,
  publishedAt: string
}
```

## 🚀 使用方法

### 1. 在组件中使用云端同步

```tsx
import { useEdgeCloudSync } from '@/hooks/useEdgeCloudSync';

const TemplateEditor = () => {
  const { 
    saveTemplateToCloud, 
    getTemplatesFromCloud, 
    deleteTemplateFromCloud,
    isSyncing,
    isOnline 
  } = useEdgeCloudSync();

  const handleSave = async (template) => {
    // 保存到本地
    await saveTemplateLocally(template);
    
    // 保存到云端
    if (isOnline) {
      await saveTemplateToCloud(template);
    }
  };

  const loadCloudTemplates = async () => {
    const cloudTemplates = await getTemplatesFromCloud('user');
    // 处理获取到的模板
  };

  return (
    <div>
      {isSyncing && <div>同步中...</div>}
      <button onClick={handleSave}>保存模板</button>
      <button onClick={loadCloudTemplates}>加载云端模板</button>
    </div>
  );
};
```

### 2. 获取公开模板

```tsx
const TemplateLibrary = () => {
  const { getPublicTemplates } = useEdgeCloudSync();
  const [publicTemplates, setPublicTemplates] = useState([]);

  useEffect(() => {
    const loadPublicTemplates = async () => {
      const templates = await getPublicTemplates('productivity');
      setPublicTemplates(templates);
    };
    
    loadPublicTemplates();
  }, []);

  return (
    <div>
      {publicTemplates.map(template => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
};
```

## 🔧 API 接口说明

### 保存模板
```
POST /api/templates/save
Content-Type: application/json

{
  "id": "template-id",
  "name": "模板名称",
  "description": "模板描述",
  "category": "productivity",
  "isPublic": false,
  "components": [...],
  "userId": "user-id"
}
```

### 获取模板列表
```
GET /api/templates/list?userId=user-id&type=user&category=productivity&limit=50

响应：
{
  "success": true,
  "data": {
    "templates": [...],
    "total": 10,
    "hasMore": false
  }
}
```

### 删除模板
```
POST /api/templates/delete
Content-Type: application/json

{
  "templateId": "template-id",
  "userId": "user-id"
}
```

## 🌟 功能特性

### 1. 多设备同步
- 用户在不同设备上的模板自动同步
- 支持离线编辑，联网后自动同步

### 2. 模板社区
- 用户可以发布模板到公开库
- 其他用户可以浏览和使用公开模板
- 支持按分类筛选

### 3. 边缘计算优势
- 全球分布式部署，就近访问
- 低延迟，高可用
- 自动扩缩容

### 4. 数据安全
- 用户数据隔离存储
- 支持数据加密
- 访问控制和权限管理

## 📈 性能优化

### 1. 缓存策略
- 利用 EdgeOne 的全球缓存网络
- 静态资源 CDN 加速
- API 响应缓存

### 2. 数据压缩
- 模板数据 JSON 压缩
- 网络传输 gzip 压缩

### 3. 批量操作
- 支持批量获取模板
- 减少 API 调用次数

## 🚨 注意事项

### 1. KV 存储限制
- 单个值最大 25MB
- 每秒写入限制
- 存储容量配额

### 2. 边缘函数限制
- 执行时间限制（30秒）
- 内存限制（128MB）
- 并发请求限制

### 3. 网络处理
- 处理网络断开情况
- 实现重试机制
- 提供离线模式

## 🔄 部署流程

1. **准备代码**：确保 `functions` 目录结构正确
2. **配置环境**：在 EdgeOne Pages 控制台配置环境变量
3. **创建 KV**：创建并配置 KV 存储命名空间
4. **部署项目**：通过 Git 或直接上传部署
5. **测试功能**：验证 API 接口和功能正常

## 📚 相关文档

- [EdgeOne Pages 官方文档](https://edgeone.cloud.tencent.com/pages/)
- [KV 存储使用指南](https://edgeone.cloud.tencent.com/pages/document/162936897742577664)
- [边缘函数开发指南](https://edgeone.cloud.tencent.com/pages/document/162936866445025280)

## 🎯 后续规划

1. **AI 功能集成**：完善 AI 优化功能
2. **实时协作**：支持多用户实时编辑
3. **版本控制**：模板版本管理和回滚
4. **数据分析**：使用统计和性能监控
