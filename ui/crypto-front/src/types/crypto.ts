// 后端返回的完整数据类型（包含 id）
export interface CryptoCurrency {
  id: number;
  symbol: string;
  name: string;
  usdPrice: string; // BigDecimal 前端以字符串接收
  updateTime: string; // 后端返回的 LocalDateTime 格式（如：2025-12-01T12:00:00）
}

// 前端推送数据的类型（无需 id，新增时后端自动生成）
export interface CryptoCurrencyRequest {
  symbol: string;
  name: string;
  usdPrice: string;
  updateTime: string; // 前端需传递 ISO 格式时间
}