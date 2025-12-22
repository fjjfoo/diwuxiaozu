// TODO: 后端接口可用时取消注释
// import { requestWithRetry } from '../utils/axiosInstance';
import type {
  SimulatedAccount,
  Position,
  Order,
  TradeRecord,
  PlaceOrderRequest,
  CryptoQuote,
} from '../types/trade';

// ============ 模拟数据 ============

// 模拟账户数据（初始资金10万USDT）
const mockAccount: SimulatedAccount = {
  balance: 52250, // 可用余额 = 100000 - 持仓市值(47750)
  totalAssets: 100000, // 总资产10万USDT
  profitLoss: 1700, // 持仓总盈亏: 750+750-150+350
  profitLossRate: 3.69, // 盈亏率: 1700/46050*100
};

// 模拟持仓数据
const mockPositions: Position[] = [
  {
    cryptoType: 'BTC',
    amount: 0.5,
    avgPrice: 42000,
    currentPrice: 43500,
    value: 21750,
    profitLoss: 750,
    profitLossRate: 3.57,
  },
  {
    cryptoType: 'ETH',
    amount: 5,
    avgPrice: 2200,
    currentPrice: 2350,
    value: 11750,
    profitLoss: 750,
    profitLossRate: 6.82,
  },
  {
    cryptoType: 'BNB',
    amount: 30,
    avgPrice: 310,
    currentPrice: 305,
    value: 9150,
    profitLoss: -150,
    profitLossRate: -1.61,
  },
  {
    cryptoType: 'SOL',
    amount: 50,
    avgPrice: 95,
    currentPrice: 102,
    value: 5100,
    profitLoss: 350,
    profitLossRate: 7.37,
  },
];

// 模拟订单数据
const mockOrders: Order[] = [
  {
    id: 1001,
    cryptoType: 'BTC',
    direction: 'buy',
    orderType: 'limit',
    price: 42500,
    amount: 0.2,
    filledAmount: 0,
    status: 'pending',
    createdAt: '2024-12-22T10:30:00',
    updatedAt: '2024-12-22T10:30:00',
  },
  {
    id: 1002,
    cryptoType: 'ETH',
    direction: 'sell',
    orderType: 'limit',
    price: 2500,
    amount: 2,
    filledAmount: 0,
    status: 'pending',
    createdAt: '2024-12-22T09:15:00',
    updatedAt: '2024-12-22T09:15:00',
  },
  {
    id: 1003,
    cryptoType: 'BTC',
    direction: 'buy',
    orderType: 'market',
    price: 43200,
    amount: 0.3,
    filledAmount: 0.3,
    status: 'completed',
    createdAt: '2024-12-21T14:20:00',
    updatedAt: '2024-12-21T14:20:05',
  },
  {
    id: 1004,
    cryptoType: 'SOL',
    direction: 'buy',
    orderType: 'market',
    price: 95,
    amount: 50,
    filledAmount: 50,
    status: 'completed',
    createdAt: '2024-12-20T11:00:00',
    updatedAt: '2024-12-20T11:00:03',
  },
];

// 模拟交易记录
const mockTradeRecords: TradeRecord[] = [
  {
    id: 2001,
    orderId: 1003,
    cryptoType: 'BTC',
    direction: 'buy',
    price: 43200,
    amount: 0.3,
    total: 12960,
    fee: 12.96,
    createdAt: '2024-12-21T14:20:05',
  },
  {
    id: 2002,
    orderId: 1004,
    cryptoType: 'SOL',
    direction: 'buy',
    price: 95,
    amount: 50,
    total: 4750,
    fee: 4.75,
    createdAt: '2024-12-20T11:00:03',
  },
  {
    id: 2003,
    orderId: 1005,
    cryptoType: 'ETH',
    direction: 'buy',
    price: 2200,
    amount: 5,
    total: 11000,
    fee: 11,
    createdAt: '2024-12-19T16:45:00',
  },
  {
    id: 2004,
    orderId: 1006,
    cryptoType: 'BNB',
    direction: 'buy',
    price: 310,
    amount: 30,
    total: 9300,
    fee: 9.3,
    createdAt: '2024-12-18T09:30:00',
  },
  {
    id: 2005,
    orderId: 1007,
    cryptoType: 'BTC',
    direction: 'buy',
    price: 42000,
    amount: 0.2,
    total: 8400,
    fee: 8.4,
    createdAt: '2024-12-17T13:20:00',
  },
  {
    id: 2006,
    orderId: 1008,
    cryptoType: 'DOGE',
    direction: 'buy',
    price: 0.095,
    amount: 10000,
    total: 950,
    fee: 0.95,
    createdAt: '2024-12-16T10:00:00',
  },
  {
    id: 2007,
    orderId: 1009,
    cryptoType: 'DOGE',
    direction: 'sell',
    price: 0.102,
    amount: 10000,
    total: 1020,
    fee: 1.02,
    profitLoss: 68.03,
    createdAt: '2024-12-17T15:30:00',
  },
];

// 模拟币种行情
const mockQuotes: CryptoQuote[] = [
  {
    symbol: 'BTC',
    name: '比特币',
    price: 43500,
    change24h: 1250,
    changeRate24h: 2.96,
    high24h: 44200,
    low24h: 42100,
    volume24h: 28500000000,
  },
  {
    symbol: 'ETH',
    name: '以太坊',
    price: 2350,
    change24h: 85,
    changeRate24h: 3.75,
    high24h: 2400,
    low24h: 2250,
    volume24h: 15200000000,
  },
  {
    symbol: 'BNB',
    name: '币安币',
    price: 305,
    change24h: -8,
    changeRate24h: -2.56,
    high24h: 318,
    low24h: 302,
    volume24h: 890000000,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 102,
    change24h: 5.5,
    changeRate24h: 5.70,
    high24h: 105,
    low24h: 96,
    volume24h: 2100000000,
  },
  {
    symbol: 'XRP',
    name: '瑞波币',
    price: 0.62,
    change24h: 0.03,
    changeRate24h: 5.08,
    high24h: 0.65,
    low24h: 0.58,
    volume24h: 1500000000,
  },
  {
    symbol: 'DOGE',
    name: '狗狗币',
    price: 0.095,
    change24h: -0.003,
    changeRate24h: -3.06,
    high24h: 0.10,
    low24h: 0.092,
    volume24h: 680000000,
  },
  {
    symbol: 'ADA',
    name: '艾达币',
    price: 0.58,
    change24h: 0.02,
    changeRate24h: 3.57,
    high24h: 0.60,
    low24h: 0.55,
    volume24h: 420000000,
  },
  {
    symbol: 'AVAX',
    name: '雪崩',
    price: 38.5,
    change24h: 1.2,
    changeRate24h: 3.22,
    high24h: 40,
    low24h: 37,
    volume24h: 560000000,
  },
];

// ============ 模拟延迟函数 ============
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ API函数（接口已注释，使用模拟数据）============

/**
 * 获取模拟账户信息
 */
export const getSimulatedAccount = async (): Promise<SimulatedAccount> => {
  // TODO: 后端接口可用时取消注释
  // const response = await requestWithRetry<SimulatedAccount>({
  //   method: 'GET',
  //   url: '/trade/account',
  // });
  // return response.data;

  await delay(300);
  return mockAccount;
};

/**
 * 获取持仓列表
 */
export const getPositions = async (): Promise<Position[]> => {
  // TODO: 后端接口可用时取消注释
  // const response = await requestWithRetry<Position[]>({
  //   method: 'GET',
  //   url: '/trade/positions',
  // });
  // return response.data;

  await delay(300);
  return mockPositions;
};

/**
 * 获取订单列表
 */
export const getOrders = async (status?: string): Promise<Order[]> => {
  // TODO: 后端接口可用时取消注释
  // const response = await requestWithRetry<Order[]>({
  //   method: 'GET',
  //   url: '/trade/orders',
  //   params: { status },
  // });
  // return response.data;

  await delay(300);
  if (status) {
    return mockOrders.filter(order => order.status === status);
  }
  return mockOrders;
};

/**
 * 获取交易记录
 */
export const getTradeRecords = async (): Promise<TradeRecord[]> => {
  // TODO: 后端接口可用时取消注释
  // const response = await requestWithRetry<TradeRecord[]>({
  //   method: 'GET',
  //   url: '/trade/records',
  // });
  // return response.data;

  await delay(300);
  return mockTradeRecords;
};

/**
 * 获取币种行情
 */
export const getCryptoQuotes = async (): Promise<CryptoQuote[]> => {
  // TODO: 后端接口可用时取消注释
  // const response = await requestWithRetry<CryptoQuote[]>({
  //   method: 'GET',
  //   url: '/trade/quotes',
  // });
  // return response.data;

  await delay(300);
  return mockQuotes;
};

/**
 * 下单
 */
export const placeOrder = async (data: PlaceOrderRequest): Promise<Order> => {
  // TODO: 后端接口可用时取消注释
  // const response = await requestWithRetry<Order>({
  //   method: 'POST',
  //   url: '/trade/orders',
  //   data,
  // });
  // return response.data;

  await delay(500);
  // 模拟下单成功
  const quote = mockQuotes.find(q => q.symbol === data.cryptoType);
  const price = data.orderType === 'market' ? (quote?.price || 0) : (data.price || 0);
  const newOrder: Order = {
    id: Date.now(),
    cryptoType: data.cryptoType,
    direction: data.direction,
    orderType: data.orderType,
    price,
    amount: data.amount,
    filledAmount: data.orderType === 'market' ? data.amount : 0,
    status: data.orderType === 'market' ? 'completed' : 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newOrder;
};

/**
 * 取消订单
 */
export const cancelOrder = async (_orderId: number): Promise<{ success: boolean }> => {
  // TODO: 后端接口可用时取消注释
  // const response = await requestWithRetry<{ success: boolean }>({
  //   method: 'DELETE',
  //   url: `/trade/orders/${orderId}`,
  // });
  // return response.data;

  await delay(300);
  return { success: true };
};

/**
 * 重置模拟账户
 */
export const resetAccount = async (): Promise<SimulatedAccount> => {
  // TODO: 后端接口可用时取消注释
  // const response = await requestWithRetry<SimulatedAccount>({
  //   method: 'POST',
  //   url: '/trade/account/reset',
  // });
  // return response.data;

  await delay(500);
  return {
    balance: 100000,
    totalAssets: 100000,
    profitLoss: 0,
    profitLossRate: 0,
  };
};
