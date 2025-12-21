// 后端返回的完整数据类型（包含 id）
export interface CryptoCurrency {
  id: number;
  symbol: string;
  name: string;
  usdPrice: string; // BigDecimal 前端以字符串接收
  cnyPrice?: string; // 人民币价格
  change24h?: string; // 24小时涨跌幅
  volume24h?: string; // 24小时成交量
  marketCap?: string; // 市值
  updateTime: string; // 后端返回的 LocalDateTime 格式（如：2025-12-01T12:00:00）
  // 新增字段用于详情页面
  currentPrice?: number;
  changeRate?: number;
  tradingVolume?: number;
  tradingVolume24h?: number;
  marketCapDominance?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  allTimeHigh?: number;
  allTimeLow?: number;
  status?: 'active' | 'inactive';
  rank?: number;
}

// 前端推送数据的类型（无需 id，新增时后端自动生成）
export interface CryptoCurrencyRequest {
  symbol: string;
  name: string;
  usdPrice: string;
  cnyPrice?: string; // 人民币价格
  change24h?: string; // 24小时涨跌幅
  volume24h?: string; // 24小时成交量
  marketCap?: string; // 市值
  updateTime: string; // 前端需传递 ISO 格式时间
}