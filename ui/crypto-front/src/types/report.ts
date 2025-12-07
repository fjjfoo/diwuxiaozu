// 报告实体类型
export interface Report {
  // 报告ID
  id: number;
  // 报告类型（如 weekly/monthly）
  reportType: string;
  // 报告名称
  name: string;
  // 报告状态（pending/reviewed/approved/rejected）
  status: string;
  // 报告内容
  content: string;
  // 生成时间
  generateTime: string;
  // 审核时间
  reviewTime?: string;
  // 审核人
  reviewer?: string;
  // 相关消息列表
  relatedMessages?: Message[];
  // 持仓快照
  portfolioSnapshot?: PortfolioItem[];
}

// 更新报告状态的请求参数类型
export interface ReportStatusUpdateRequest {
  // 报告状态
  status: string;
  // 审核人
  reviewer?: string;
  // 审核意见
  comments?: string;
}

// 获取报告列表的请求参数类型
export interface ReportRequest {
  // 页码，从1开始
  page?: number;
  // 每页大小
  pageSize?: number;
  // 报告状态筛选
  status?: string;
  // 报告类型筛选
  reportType?: string;
  // 开始时间
  startTime?: string;
  // 结束时间
  endTime?: string;
}

// 导入相关类型
import type { Message } from './message';
import type { PortfolioItem } from './portfolio';
