// 交易方向
export type TradeDirection = 'buy' | 'sell';

// 订单状态
export type OrderStatus = 'pending' | 'completed' | 'cancelled';

// 订单类型
export type OrderType = 'market' | 'limit';

// 模拟账户信息
export interface SimulatedAccount {
  balance: number; // USDT余额
  totalAssets: number; // 总资产估值
  profitLoss: number; // 总盈亏
  profitLossRate: number; // 盈亏率
}

// 持仓信息
export interface Position {
  cryptoType: string; // 币种
  amount: number; // 持有数量
  avgPrice: number; // 平均成本价
  currentPrice: number; // 当前价格
  value: number; // 当前价值
  profitLoss: number; // 盈亏金额
  profitLossRate: number; // 盈亏率
}

// 订单信息
export interface Order {
  id: number;
  cryptoType: string; // 币种
  direction: TradeDirection; // 买入/卖出
  orderType: OrderType; // 市价/限价
  price: number; // 委托价格
  amount: number; // 委托数量
  filledAmount: number; // 已成交数量
  status: OrderStatus; // 订单状态
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 交易记录
export interface TradeRecord {
  id: number;
  orderId: number;
  cryptoType: string; // 币种
  direction: TradeDirection; // 买入/卖出
  price: number; // 成交价格
  amount: number; // 成交数量
  total: number; // 成交金额
  fee: number; // 手续费
  profitLoss?: number; // 盈亏（卖出时计算）
  createdAt: string; // 成交时间
}

// 下单请求
export interface PlaceOrderRequest {
  cryptoType: string;
  direction: TradeDirection;
  orderType: OrderType;
  price?: number; // 限价单需要
  amount: number;
}

// 币种行情
export interface CryptoQuote {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changeRate24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}
