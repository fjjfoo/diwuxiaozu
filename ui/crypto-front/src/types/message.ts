// 消息实体类型
export interface Message {
  // 消息ID
  id: number;
  // 消息标题
  title: string;
  // 消息内容
  content: string;
  // 加密货币类型（如 BTC、ETH）
  cryptoType: string;
  // 情感分析结果（positive/negative/neutral）
  sentiment: string;
  // 来源平台（如 Twitter、Reddit）
  source: string;
  // 发布时间
  publishTime: string;
  // 创建时间
  createTime: string;
  // 是否已读
  isRead: boolean;
}

// 获取消息列表的请求参数类型
export interface MessageRequest {
  // 页码，从1开始
  page?: number;
  // 每页大小
  pageSize?: number;
  // 加密货币类型筛选
  cryptoType?: string;
  // 情感分析结果筛选
  sentiment?: string;
  // 来源平台筛选
  source?: string;
  // 是否已读筛选
  isRead?: boolean;
  // 开始时间
  startTime?: string;
  // 结束时间
  endTime?: string;
}
