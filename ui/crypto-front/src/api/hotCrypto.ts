import { requestWithRetry } from '../utils/axiosInstance';
import type { HotCrypto, HotCryptoRequest, HotCryptoResponse } from '../types/hotCrypto';

// 模拟数据
const mockHotCryptoData: HotCrypto[] = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 97234.56,
    change1h: 0.32,
    change24h: 2.15,
    marketCap: 1920000000000,
    volume24h: 45600000000,
    dexLiquidity: 8500000000,
    age: '15年',
    dexTrades24h: 125000,
    securityScore: 98,
    securityStatus: 'safe',
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3456.78,
    change1h: -0.15,
    change24h: 1.85,
    marketCap: 415000000000,
    volume24h: 18900000000,
    dexLiquidity: 12000000000,
    age: '9年',
    dexTrades24h: 890000,
    securityScore: 96,
    securityStatus: 'safe',
  },
  {
    id: 3,
    name: 'Solana',
    symbol: 'SOL',
    price: 189.45,
    change1h: 1.25,
    change24h: 5.67,
    marketCap: 89000000000,
    volume24h: 3200000000,
    dexLiquidity: 2800000000,
    age: '4年',
    dexTrades24h: 456000,
    securityScore: 92,
    securityStatus: 'safe',
  },
  {
    id: 4,
    name: 'BNB',
    symbol: 'BNB',
    price: 698.32,
    change1h: 0.08,
    change24h: -0.45,
    marketCap: 104000000000,
    volume24h: 1800000000,
    dexLiquidity: 3500000000,
    age: '7年',
    dexTrades24h: 234000,
    securityScore: 94,
    securityStatus: 'safe',
  },
  {
    id: 5,
    name: 'XRP',
    symbol: 'XRP',
    price: 2.34,
    change1h: -0.52,
    change24h: 3.21,
    marketCap: 134000000000,
    volume24h: 8900000000,
    dexLiquidity: 1200000000,
    age: '12年',
    dexTrades24h: 89000,
    securityScore: 88,
    securityStatus: 'safe',
  },
  {
    id: 6,
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: 0.3245,
    change1h: 2.15,
    change24h: 8.92,
    marketCap: 48000000000,
    volume24h: 2100000000,
    dexLiquidity: 890000000,
    age: '11年',
    dexTrades24h: 156000,
    securityScore: 85,
    securityStatus: 'safe',
  },
  {
    id: 7,
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.9876,
    change1h: -0.28,
    change24h: 1.45,
    marketCap: 35000000000,
    volume24h: 890000000,
    dexLiquidity: 450000000,
    age: '7年',
    dexTrades24h: 67000,
    securityScore: 90,
    securityStatus: 'safe',
  },
  {
    id: 8,
    name: 'Avalanche',
    symbol: 'AVAX',
    price: 38.56,
    change1h: 0.95,
    change24h: 4.32,
    marketCap: 15800000000,
    volume24h: 560000000,
    dexLiquidity: 780000000,
    age: '4年',
    dexTrades24h: 123000,
    securityScore: 91,
    securityStatus: 'safe',
  },
  {
    id: 9,
    name: 'Shiba Inu',
    symbol: 'SHIB',
    price: 0.0000225,
    change1h: 3.45,
    change24h: 12.34,
    marketCap: 13200000000,
    volume24h: 780000000,
    dexLiquidity: 320000000,
    age: '4年',
    dexTrades24h: 234000,
    securityScore: 72,
    securityStatus: 'warning',
  },
  {
    id: 10,
    name: 'Polkadot',
    symbol: 'DOT',
    price: 7.23,
    change1h: -0.12,
    change24h: 2.56,
    marketCap: 10500000000,
    volume24h: 320000000,
    dexLiquidity: 280000000,
    age: '4年',
    dexTrades24h: 45000,
    securityScore: 93,
    securityStatus: 'safe',
  },
  {
    id: 11,
    name: 'Pepe',
    symbol: 'PEPE',
    price: 0.0000198,
    change1h: 5.67,
    change24h: 18.92,
    marketCap: 8300000000,
    volume24h: 1200000000,
    dexLiquidity: 450000000,
    age: '2年',
    dexTrades24h: 567000,
    securityScore: 65,
    securityStatus: 'warning',
  },
  {
    id: 12,
    name: 'Chainlink',
    symbol: 'LINK',
    price: 23.45,
    change1h: 0.45,
    change24h: 3.78,
    marketCap: 14600000000,
    volume24h: 890000000,
    dexLiquidity: 560000000,
    age: '7年',
    dexTrades24h: 78000,
    securityScore: 95,
    securityStatus: 'safe',
  },
];

/**
 * 获取热门货币列表
 * 当后端接口可用时，取消注释下面的代码并删除模拟数据逻辑
 */
export const getHotCryptoList = async (params?: HotCryptoRequest): Promise<{ data: HotCryptoResponse }> => {
  // TODO: 后端接口可用时启用
  // return requestWithRetry<HotCryptoResponse>({
  //   method: 'GET',
  //   url: '/hot-crypto/list',
  //   params,
  // });

  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: {
      data: mockHotCryptoData.slice(start, end),
      total: mockHotCryptoData.length,
      page,
      pageSize,
    }
  };
};

/**
 * 获取单个热门货币详情
 */
export const getHotCryptoDetail = async (id: number): Promise<{ data: HotCrypto | null }> => {
  // TODO: 后端接口可用时启用
  // return requestWithRetry<HotCrypto>({
  //   method: 'GET',
  //   url: `/hot-crypto/${id}`,
  // });

  await new Promise(resolve => setTimeout(resolve, 300));
  const crypto = mockHotCryptoData.find(item => item.id === id);
  return { data: crypto || null };
};
