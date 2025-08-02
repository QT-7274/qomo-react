# EdgeOne Pages KV 存储多用户访问说明

## 🤔 你的问题很好！

> "如果这个网站被多个人访问，那 KV 都是存储在一起的么？"

**答案：是的，所有用户的数据都存储在同一个 KV 命名空间中。**

## 🏗️ 数据隔离策略

### 1. 通过键名前缀实现用户隔离

我们在设计中使用了键名前缀来区分不同用户的数据：

```javascript
// 用户模板存储格式
const userKey = `template:${userId}:${templateId}`;
// 例如：template:user123:template456

// 公开模板存储格式  
const publicKey = `public:template:${templateId}`;
// 例如：public:template:template456

// 访问计数器（全局共享）
const counterKey = 'visit_count';
```

### 2. 数据访问权限控制

```javascript
// 获取用户自己的模板
const userTemplates = await qomo.list({
  prefix: `template:${userId}:`,  // 只能看到自己的模板
  limit: 50
});

// 获取公开模板（所有人都能看到）
const publicTemplates = await qomo.list({
  prefix: 'public:template:',
  limit: 50
});
```

## 📊 实际的数据结构示例

假设有两个用户 Alice 和 Bob：

```
KV 存储中的数据：
├── template:alice:template1     (Alice 的私有模板)
├── template:alice:template2     (Alice 的私有模板)
├── template:bob:template1       (Bob 的私有模板)
├── template:bob:template3       (Bob 的私有模板)
├── public:template:shared1      (公开模板，所有人可见)
├── public:template:shared2      (公开模板，所有人可见)
└── visit_count                  (全局访问计数器)
```

## 🔒 安全性考虑

### 1. 用户身份识别
目前的实现使用简单的 `userId` 参数，在生产环境中应该：

```javascript
// 当前实现（测试用）
const userId = templateData.userId || 'anonymous';

// 生产环境建议
const userId = await getUserIdFromAuth(request); // 从认证系统获取
if (!userId) {
  return new Response(JSON.stringify({
    success: false,
    error: '未授权访问'
  }), { status: 401 });
}
```

### 2. 访问权限验证

```javascript
// 删除模板时验证所有权
const templateData = await qomo.get(`template:${userId}:${templateId}`);
if (!templateData) {
  return new Response(JSON.stringify({
    success: false,
    error: '模板不存在或无权限访问'
  }), { status: 404 });
}
```

## 🌟 优势和特点

### 1. 简单高效
- 单一 KV 命名空间，管理简单
- 通过键名前缀实现逻辑分离
- 查询效率高

### 2. 灵活扩展
```javascript
// 可以轻松添加新的数据类型
const userSettingsKey = `settings:${userId}`;
const userStatsKey = `stats:${userId}:${date}`;
const teamTemplateKey = `team:${teamId}:template:${templateId}`;
```

### 3. 成本控制
- 所有用户共享一个 KV 命名空间
- 避免为每个用户创建单独的命名空间
- 降低管理复杂度

## 🚨 注意事项

### 1. 键名冲突
确保键名设计合理，避免不同用户的数据冲突：

```javascript
// ❌ 可能冲突的设计
const key = templateId; // 不同用户可能有相同的 templateId

// ✅ 正确的设计
const key = `template:${userId}:${templateId}`;
```

### 2. 数据量限制
- EdgeOne KV 有存储配额限制
- 需要定期清理过期数据
- 考虑实现数据归档策略

### 3. 查询性能
```javascript
// ✅ 高效查询（使用前缀）
const userTemplates = await qomo.list({ prefix: `template:${userId}:` });

// ❌ 低效查询（需要遍历所有数据）
const allData = await qomo.list();
const userTemplates = allData.keys.filter(key => key.includes(userId));
```

## 🔄 未来改进建议

### 1. 用户认证集成
```javascript
// 集成 JWT 或其他认证系统
const token = request.headers.get('Authorization');
const userId = await verifyToken(token);
```

### 2. 权限管理
```javascript
// 实现基于角色的访问控制
const userRole = await getUserRole(userId);
if (userRole !== 'admin' && !canAccessTemplate(userId, templateId)) {
  return unauthorizedResponse();
}
```

### 3. 数据加密
```javascript
// 敏感数据加密存储
const encryptedData = await encrypt(templateData, userKey);
await qomo.put(key, encryptedData);
```

## 📈 监控和统计

可以通过键名前缀轻松实现用户统计：

```javascript
// 统计用户模板数量
const userTemplateCount = await qomo.list({ 
  prefix: `template:${userId}:` 
});

// 统计公开模板数量
const publicTemplateCount = await qomo.list({ 
  prefix: 'public:template:' 
});

// 全局访问统计
const totalVisits = await qomo.get('visit_count');
```

总结：虽然所有数据存储在同一个 KV 命名空间中，但通过合理的键名设计和访问控制，可以有效实现多用户数据隔离和安全访问。
