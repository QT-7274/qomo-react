# EdgeOne Pages KV 存储配置指南

## 🚨 当前问题

如果你看到以下错误：
```json
{
  "success": false,
  "error": "KV 存储测试失败: Cannot read properties of undefined (reading 'put')",
  "details": {
    "errorType": "TypeError",
    "errorMessage": "Cannot read properties of undefined (reading 'put')"
  }
}
```

这说明 KV 存储的环境变量没有正确配置。

## 🔧 解决方案

### 步骤 1：创建 KV 命名空间

1. 登录 [EdgeOne Pages 控制台](https://edgeone.cloud.tencent.com/pages/)
2. 进入你的项目
3. 点击左侧菜单 "KV 存储"
4. 点击 "创建命名空间"
5. 输入命名空间名称：`qomo-templates`
6. 点击 "确定" 创建

### 步骤 2：绑定 KV 命名空间

1. 在项目控制台中，点击 "设置" 标签
2. 找到 "KV 命名空间绑定" 部分
3. 点击 "添加绑定"
4. 配置如下：
   ```
   变量名：qomo
   KV 命名空间：选择你刚创建的 qomo-templates 命名空间
   ```
5. 点击 "保存"

**注意**：这里是 KV 命名空间绑定，不是环境变量！EdgeOne Pages 会自动将绑定的命名空间作为参数传递给函数。

### 步骤 3：重新部署

1. 触发重新部署（推送代码或手动部署）
2. 等待部署完成
3. 测试 API 接口

## 📋 验证配置

部署完成后，访问以下接口验证配置：

```bash
# 测试 KV 存储
GET https://your-domain.com/api/test/kv

# 测试计数器
GET https://your-domain.com/api/test/counter
```

成功的响应应该类似：
```json
{
  "success": true,
  "message": "KV 存储测试成功！",
  "data": {
    "testResults": {
      "write": "✅ 写入成功",
      "read": "✅ 读取成功",
      "list": "✅ 列表成功",
      "delete": "✅ 删除成功"
    }
  }
}
```

## 🔍 调试信息

如果仍然有问题，修改后的函数会返回详细的调试信息：

```json
{
  "success": false,
  "error": "KV 存储未配置",
  "details": {
    "message": "环境变量 qomo 未找到",
    "availableEnvVars": ["NODE_ENV", "OTHER_VAR"],
    "solution": "请在 EdgeOne Pages 控制台配置 KV 命名空间环境变量 qomo"
  }
}
```

## 📝 常见问题

### Q1: 绑定变量名称是否正确？
A: 必须使用 `qomo` 作为绑定变量名，这与函数代码中的参数 `qomo` 对应。

### Q2: 是环境变量还是 KV 绑定？
A: 是 KV 命名空间绑定，不是环境变量！在 EdgeOne Pages 控制台的 "KV 命名空间绑定" 部分配置。

### Q3: 为什么配置后还是不工作？
A: 确保：
- 绑定变量名称正确（`qomo`）
- 选择了正确的 KV 命名空间
- 重新部署了项目
- 等待部署完全完成

### Q4: 如何测试配置是否成功？
A: 访问 `/api/test/kv` 接口，如果返回成功响应说明配置正确。

## 🎯 下一步

配置成功后，你可以：

1. **测试基础功能**：
   - 访问 `/edgeone-test` 页面
   - 点击各种测试按钮

2. **集成到项目**：
   ```tsx
   import { useEdgeCloudSync } from '@/hooks/useEdgeCloudSync';
   
   const { saveTemplateToCloud, getTemplatesFromCloud } = useEdgeCloudSync();
   ```

3. **开始使用云端同步**：
   - 保存模板到云端
   - 多设备同步
   - 公开模板分享

## 📞 技术支持

如果按照以上步骤仍然无法解决问题，请检查：

1. EdgeOne Pages 控制台中的部署日志
2. 函数执行日志
3. KV 存储的访问权限
4. 网络连接状态

记住：环境变量的配置需要重新部署才能生效！
