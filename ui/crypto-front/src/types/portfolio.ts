// 持仓项目类型
export interface PortfolioItem {
  // 持仓ID
  id: number;
  // 加密货币类型（如 BTC、ETH）
  cryptoType: string;
  // 持仓数量
  quantity: number;
  // 平均买入价格（单位：USD）
  avgBuyPrice: number;
  // 当前价格（单位：USD）
  currentPrice: number;
  // 总价值（单位：USD）
  totalValue: number;
  // 盈亏金额（单位：USD）
  profitLoss: number;
  // 盈亏比例（%）
  profitLossPercent: number;
  // 更新时间
  updateTime: string;
}

// 持仓历史类型
export interface PortfolioHistory {
  // 历史记录ID
  id: number;
  // 记录日期
  recordDate: string;
  // 总资产价值（单位：USD）
  totalAssetValue: number;
  // 持仓项目列表
  items: PortfolioItem[];
}

// 更新持仓的请求参数类型
export interface PortfolioUpdateRequest {
  // 加密货币类型
  cryptoType: string;
  // 持仓数量
  quantity: number;
  // 平均买入价格
  avgBuyPrice: number;
}

// 获取持仓历史的请求参数类型
export interface PortfolioHistoryRequest {
  // 开始日期
  startDate?: string;
  // 结束日期
  endDate?: string;
  // 页码，从1开始
  page?: number;
  // 每页大小
  pageSize?: number;
}
