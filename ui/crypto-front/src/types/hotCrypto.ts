/**
 * 热门货币数据类型
 */
export interface HotCrypto {
  id: number;
  name: string;           // 名称
  symbol: string;         // 符号
  logo?: string;          // Logo URL
  price: number;          // 价格 (USD)
  change1h: number;       // 1小时涨跌幅 (%)
  change24h: number;      // 24小时涨跌幅 (%)
  marketCap: number;      // 市值
  volume24h: number;      // 24小时交易量
  dexLiquidity: number;   // DEX流动性
  age: string;            // 年龄 (如: "2年3月")
  dexTrades24h: number;   // DEX交易次数（24小时）
  securityScore: number;  // 安全扫描分数 (0-100)
  securityStatus: 'safe' | 'warning' | 'danger'; // 安全状态
}

/**
 * 热门货币请求参数
 */
export interface HotCryptoRequest {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 热门货币响应
 */
export interface HotCryptoResponse {
  data: HotCrypto[];
  total: number;
  page: number;
  pageSize: number;
}
