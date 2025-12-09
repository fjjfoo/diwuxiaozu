# AI驱动数字货币投资辅助系统 - 后端API设计文档

## 1. 系统概览

### 1.1 架构概述
后端采用Spring Boot框架开发，提供RESTful API接口，支持前端应用与AI智能体的数据交互。

### 1.2 技术栈
- Java Spring Boot 3.x
- Spring Data JPA
- MySQL 8.0
- Spring Scheduler (定时任务)
- Spring Security (可选，用于权限控制)

## 2. API接口设计

### 2.1 系统概览接口

#### 2.1.1 获取系统概览数据
```
GET /api/system/overview
```

**响应示例：**
```json
{
  "unreadMessages": 12,
  "pendingReports": 3,
  "totalAssets": 10500000
}
```

### 2.2 消息管理接口

#### 2.2.1 获取消息列表
```
GET /api/messages
```

**请求参数：**
- `cryptoType` (可选)：数字货币类型（如BTC、ETH、SOL）
- `sentiment` (可选)：情感倾向（positive、negative、neutral）
- `startDate` (可选)：开始日期（格式：YYYY-MM-DD）
- `endDate` (可选)：结束日期（格式：YYYY-MM-DD）
- `page` (可选，默认1)：页码
- `size` (可选，默认10)：每页数量

**响应示例：**
```json
{
  "total": 100,
  "pages": 10,
  "current": 1,
  "records": [
    {
      "id": 1,
      "cryptoType": "BTC",
      "content": "美联储加息预期减弱，比特币价格突破45000美元",
      "sentiment": "positive",
      "source": "CoinGecko",
      "sourceUrl": "https://www.coingecko.com",
      "createdAt": "2024-01-15T10:30:00",
      "isRead": false
    }
  ]
}
```

#### 2.2.2 获取消息详情
```
GET /api/messages/{id}
```

**响应示例：**
```json
{
  "id": 1,
  "cryptoType": "BTC",
  "content": "美联储加息预期减弱，比特币价格突破45000美元",
  "sentiment": "positive",
  "source": "CoinGecko",
  "sourceUrl": "https://www.coingecko.com",
  "createdAt": "2024-01-15T10:30:00",
  "isRead": false
}
```

#### 2.2.3 标记消息为已读
```
PUT /api/messages/{id}/read
```

**响应示例：**
```json
{
  "success": true,
  "message": "消息已标记为已读"
}
```

### 2.3 持仓数据管理接口

#### 2.3.1 获取当前持仓
```
GET /api/portfolio/current
```

**响应示例：**
```json
{
  "totalValue": 10500000,
  "items": [
    {
      "id": 1,
      "cryptoType": "BTC",
      "quantity": 10,
      "price": 45000,
      "value": 450000,
      "percentage": 4.29
    },
    {
      "id": 2,
      "cryptoType": "ETH",
      "quantity": 100,
      "price": 2500,
      "value": 250000,
      "percentage": 2.38
    }
  ]
}
```

#### 2.3.2 获取持仓历史
```
GET /api/portfolio/history
```

**请求参数：**
- `days` (可选，默认7)：查询天数

**响应示例：**
```json
[
  {
    "date": "2024-01-10",
    "totalValue": 10000000,
    "items": [
      {
        "cryptoType": "BTC",
        "percentage": 4.0
      },
      {
        "cryptoType": "ETH",
        "percentage": 3.5
      }
    ]
  },
  {
    "date": "2024-01-11",
    "totalValue": 10200000,
    "items": [
      {
        "cryptoType": "BTC",
        "percentage": 4.1
      },
      {
        "cryptoType": "ETH",
        "percentage": 3.6
      }
    ]
  }
]
```

#### 2.3.3 更新持仓数据
```
PUT /api/portfolio
```

**请求示例：**
```json
{
  "items": [
    {
      "cryptoType": "BTC",
      "quantity": 10.5,
      "price": 45000
    },
    {
      "cryptoType": "ETH",
      "quantity": 105,
      "price": 2500
    }
  ]
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "持仓数据已更新",
  "data": {
    "totalValue": 10725000,
    "items": [
      {
        "cryptoType": "BTC",
        "quantity": 10.5,
        "price": 45000,
        "value": 472500,
        "percentage": 4.41
      },
      {
        "cryptoType": "ETH",
        "quantity": 105,
        "price": 2500,
        "value": 262500,
        "percentage": 2.45
      }
    ]
  }
}
```

### 2.4 AI建议报告接口

#### 2.4.1 获取报告列表
```
GET /api/reports
```

**请求参数：**
- `status` (可选)：报告状态（pending、approved、rejected）
- `page` (可选，默认1)：页码
- `size` (可选，默认10)：每页数量

**响应示例：**
```json
{
  "total": 20,
  "pages": 2,
  "current": 1,
  "records": [
    {
      "id": 1,
      "title": "2024-01-15 投资调整建议",
      "status": "pending",
      "createdAt": "2024-01-15T09:00:00",
      "messageCount": 5
    },
    {
      "id": 2,
      "title": "2024-01-14 投资调整建议",
      "status": "approved",
      "createdAt": "2024-01-14T09:00:00",
      "messageCount": 3
    }
  ]
}
```

#### 2.4.2 获取报告详情
```
GET /api/reports/{id}
```

**响应示例：**
```json
{
  "id": 1,
  "title": "2024-01-15 投资调整建议",
  "status": "pending",
  "createdAt": "2024-01-15T09:00:00",
  "messages": [
    {
      "id": 1,
      "cryptoType": "BTC",
      "content": "美联储加息预期减弱，比特币价格突破45000美元",
      "sentiment": "positive"
    }
  ],
  "portfolioSnapshot": {
    "totalValue": 10500000,
    "items": [
      {
        "cryptoType": "BTC",
        "quantity": 10,
        "price": 45000,
        "value": 450000,
        "percentage": 4.29
      }
    ]
  },
  "suggestions": [
    {
      "cryptoType": "BTC",
      "currentPercentage": 4.29,
      "suggestedPercentage": 5.0,
      "reason": "受美联储加息预期减弱影响，BTC短期内有上涨空间"
    }
  ],
  "reviewComments": null,
  "reviewedAt": null,
  "reviewerId": null
}
```

#### 2.4.3 创建报告（供AI智能体调用）
```
POST /api/reports
```

**请求示例：**
```json
{
  "title": "2024-01-15 投资调整建议",
  "messages": [
    {
      "cryptoType": "BTC",
      "content": "美联储加息预期减弱，比特币价格突破45000美元",
      "sentiment": "positive",
      "source": "CoinGecko",
      "sourceUrl": "https://www.coingecko.com"
    }
  ],
  "suggestions": [
    {
      "cryptoType": "BTC",
      "currentPercentage": 4.29,
      "suggestedPercentage": 5.0,
      "reason": "受美联储加息预期减弱影响，BTC短期内有上涨空间"
    }
  ]
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "报告已创建",
  "data": {
    "id": 1,
    "title": "2024-01-15 投资调整建议",
    "status": "pending"
  }
}
```

#### 2.4.4 审核报告
```
PUT /api/reports/{id}/review
```

**请求示例：**
```json
{
  "status": "approved",
  "comments": "同意AI建议，执行调整"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "报告已审核通过",
  "data": {
    "id": 1,
    "status": "approved",
    "reviewComments": "同意AI建议，执行调整",
    "reviewedAt": "2024-01-15T10:30:00",
    "reviewerId": 1
  }
}
```

### 2.5 AI智能体专用接口

#### 2.5.1 获取当前持仓（供AI智能体调用）
```
GET /api/ai/portfolio
```

**响应示例：**
```json
{
  "totalValue": 10500000,
  "items": [
    {
      "cryptoType": "BTC",
      "quantity": 10,
      "price": 45000,
      "value": 450000,
      "percentage": 4.29
    },
    {
      "cryptoType": "ETH",
      "quantity": 100,
      "price": 2500,
      "value": 250000,
      "percentage": 2.38
    }
  ]
}
```

## 3. 数据库设计

### 3.1 核心实体

#### 3.1.1 消息表（message）
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | BIGINT | 主键 |
| crypto_type | VARCHAR(10) | 数字货币类型 |
| content | TEXT | 消息内容 |
| sentiment | VARCHAR(10) | 情感倾向 |
| source | VARCHAR(50) | 消息来源 |
| source_url | VARCHAR(255) | 消息链接 |
| created_at | DATETIME | 创建时间 |
| is_read | BOOLEAN | 是否已读 |

#### 3.1.2 持仓表（portfolio）
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | BIGINT | 主键 |
| crypto_type | VARCHAR(10) | 数字货币类型 |
| quantity | DECIMAL(20,8) | 数量 |
| price | DECIMAL(20,2) | 单价 |
| value | DECIMAL(20,2) | 总价值 |
| percentage | DECIMAL(5,2) | 占比 |
| updated_at | DATETIME | 更新时间 |

#### 3.1.3 持仓历史表（portfolio_history）
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | BIGINT | 主键 |
| record_date | DATE | 记录日期 |
| crypto_type | VARCHAR(10) | 数字货币类型 |
| quantity | DECIMAL(20,8) | 数量 |
| price | DECIMAL(20,2) | 单价 |
| value | DECIMAL(20,2) | 总价值 |
| percentage | DECIMAL(5,2) | 占比 |

#### 3.1.4 报告表（report）
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | BIGINT | 主键 |
| title | VARCHAR(100) | 报告标题 |
| status | VARCHAR(10) | 报告状态 |
| created_at | DATETIME | 创建时间 |
| reviewed_at | DATETIME | 审核时间 |
| reviewer_id | BIGINT | 审核人ID |
| review_comments | TEXT | 审核意见 |

#### 3.1.5 报告建议表（report_suggestion）
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | BIGINT | 主键 |
| report_id | BIGINT | 报告ID |
| crypto_type | VARCHAR(10) | 数字货币类型 |
| current_percentage | DECIMAL(5,2) | 当前占比 |
| suggested_percentage | DECIMAL(5,2) | 建议占比 |
| reason | TEXT | 建议理由 |

## 4. 定时任务设计

### 4.1 每日消息采集任务
- 触发时间：每日08:00
- 任务逻辑：调用Dify智能体接口，采集当日数字货币市场消息
- 异常处理：采集失败时自动重试3次，仍失败则记录日志并发送告警

### 4.2 持仓数据备份任务
- 触发时间：每日23:59
- 任务逻辑：将当日持仓数据备份到持仓历史表

## 5. 安全设计

### 5.1 API认证（可选）
- 使用JWT Token进行API认证
- 为AI智能体分配专用API密钥

### 5.2 数据加密
- 敏感数据（如API密钥）在数据库中加密存储
- HTTPS协议传输数据

## 6. 错误处理

### 6.1 统一错误响应格式
```json
{
  "code": 500,
  "message": "服务器内部错误",
  "details": "具体错误信息"
}
```

### 6.2 常见错误码
| 错误码 | 描述 |
|-------|------|
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 503 | 服务不可用 |

## 7. 接口版本管理

采用URI版本控制，如：
```
GET /api/v1/messages
```

## 8. 部署建议

### 8.1 环境要求
- JDK 17+
- MySQL 8.0+
- 4GB+ RAM
- 50GB+ 磁盘空间

### 8.2 部署方式
- Docker容器化部署
-  Kubernetes集群管理（可选）

## 9. 监控与日志

### 9.1 监控指标
- API响应时间
- 请求成功率
- 系统资源使用率

### 9.2 日志记录
- 使用SLF4J + Logback记录日志
- 关键操作（如报告审核、持仓更新）记录审计日志
- 错误日志自动告警

---

# AI驱动数字货币投资辅助系统 - Dify集成方案

## 1. Dify智能体设计

### 1.1 智能体架构

Dify智能体负责：
1. 每日定时采集数字货币市场消息
2. 对消息进行情感分析
3. 获取当前持仓数据
4. 生成投资调整建议
5. 创建建议报告

### 1.2 智能体流程

1. **消息采集阶段**：
   - 调用数据源API（如CoinGecko、Binance）获取市场消息
   - 对消息进行初步筛选和分类

2. **情感分析阶段**：
   - 使用大语言模型对消息进行情感分析
   - 标注消息为利好（positive）、利空（negative）或中性（neutral）

3. **持仓分析阶段**：
   - 调用后端API获取当前持仓数据
   - 结合消息情感分析结果，评估当前持仓合理性

4. **建议生成阶段**：
   - 基于分析结果，生成具体的投资调整建议
   - 包含建议调整的币种、比例和理由

5. **报告创建阶段**：
   - 将分析结果和建议整合为报告
   - 调用后端API创建建议报告

### 2. Prompt设计

#### 2.1 消息情感分析Prompt

```
请分析以下数字货币市场消息的情感倾向，并给出理由：

消息内容：{message_content}
涉及币种：{crypto_type}

请以JSON格式返回结果，包含以下字段：
- sentiment: 情感倾向，只能是"positive"（利好）、"negative"（利空）或"neutral"（中性）
- reason: 分析理由（不超过100字）
```

#### 2.2 持仓分析与建议Prompt

```
作为专业的数字货币投资顾问，请结合以下市场消息和当前持仓数据，分析持仓合理性并给出调整建议：

市场消息：
{messages_list}

当前持仓：
{portfolio_data}

请以JSON格式返回结果，包含以下字段：
- suggestions: 调整建议数组，每个建议包含cryptoType（币种）、currentPercentage（当前占比）、suggestedPercentage（建议占比）、reason（建议理由）
- summary: 整体分析总结（不超过200字）
```

### 3. API调用流程

#### 3.1 Dify智能体调用后端API

1. **获取当前持仓**：
   ```
   GET /api/ai/portfolio
   ```

2. **创建建议报告**：
   ```
   POST /api/reports
   ```

#### 3.2 后端调用Dify智能体API

1. **触发消息采集**：
   ```
   POST https://api.dify.ai/v1/agents/{agent_id}/trigger
   ```

   **请求参数**：
   ```json
   {
     "inputs": {
       "trigger_type": "daily_collection"
     },
     "response_mode": "streaming"
   }
   ```

### 4. 数据格式约定

#### 4.1 消息数据格式

```json
{
  "cryptoType": "BTC",
  "content": "美联储加息预期减弱，比特币价格突破45000美元",
  "sentiment": "positive",
  "source": "CoinGecko",
  "sourceUrl": "https://www.coingecko.com"
}
```

#### 4.2 持仓数据格式

```json
{
  "totalValue": 10500000,
  "items": [
    {
      "cryptoType": "BTC",
      "quantity": 10,
      "price": 45000,
      "value": 450000,
      "percentage": 4.29
    }
  ]
}
```

#### 4.3 建议数据格式

```json
[
  {
    "cryptoType": "BTC",
    "currentPercentage": 4.29,
    "suggestedPercentage": 5.0,
    "reason": "受美联储加息预期减弱影响，BTC短期内有上涨空间"
  }
]
```

### 5. 异常处理

#### 5.1 网络异常
- 调用API时发生网络异常，自动重试3次
- 重试间隔：1秒、3秒、5秒

#### 5.2 数据格式异常
- 对API返回数据进行格式校验
- 格式异常时记录日志并触发告警

#### 5.3 超时处理
- 设置合理的API调用超时时间（建议10秒）
- 超时后记录日志并触发告警

### 6. 性能优化

#### 6.1 批量处理
- 消息采集和分析采用批量处理方式
- 减少API调用次数

#### 6.2 缓存策略
- 对频繁访问的数据（如当前持仓）进行缓存
- 缓存过期时间：5分钟

#### 6.3 异步处理
- 消息采集和分析采用异步处理方式
- 提高系统吞吐量

### 7. 监控与日志

#### 7.1 监控指标
- 智能体执行时间
- 消息采集数量
- 情感分析准确率
- API调用成功率

#### 7.2 日志记录
- 记录智能体执行日志
- 记录API调用日志
- 异常情况自动告警

---

# 前端页面设计总结

## 1. 系统概览页
- **核心指标展示**：未读消息数、待审核报告数、当前总资产估值
- **功能入口**：消息列表、报告审核、持仓数据的快速访问按钮
- **设计风格**：简洁明了，突出核心数据

## 2. 消息列表页
- **消息展示**：按时间倒序展示消息，支持分页
- **筛选功能**：按数字货币类型、情感倾向、时间范围筛选
- **消息详情**：点击详情按钮查看消息完整内容和来源链接
- **状态管理**：标记消息为已读/未读

## 3. 持仓数据页
- **资产占比图**：使用饼图展示当前各币种资产占比
- **持仓变化图**：使用折线图展示近7日持仓变化趋势
- **持仓明细表**：详细列出各币种的持仓数量、单价、总价值和占比
- **数据导出**：支持导出持仓数据为Excel格式

## 4. 建议报告页
- **报告列表**：展示AI生成的建议报告，按时间倒序排列
- **报告详情**：查看报告包含的市场消息、当前持仓快照和具体建议
- **审核功能**：支持审核通过/驳回报告，填写审核意见
- **状态跟踪**：实时展示报告的审核状态

## 5. 技术实现
- **框架**：React 18 + TypeScript
- **UI组件库**：Ant Design 5.x
- **图表库**：ECharts for React
- **路由管理**：React Router 6.x
- **HTTP请求**：Axios + 自定义Hook
- **状态管理**：React Hooks
- **日期处理**：Dayjs

## 6. 响应式设计
- 支持电脑端访问
- 适配不同屏幕尺寸
- 保证在1280px以上分辨率下有良好的显示效果

## 7. 用户体验优化
- 加载状态提示
- 错误处理和友好提示
- 操作反馈（如按钮点击效果）
- 平滑的页面切换动画
- 清晰的视觉层次和导航结构