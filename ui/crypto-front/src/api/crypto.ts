import { requestWithRetry } from '../utils/axiosInstance';
import { type CryptoCurrency, type CryptoCurrencyRequest } from '../types/crypto';

/**
 * 查询所有数据
 */
export const getCryptoList = () => {
  return requestWithRetry<CryptoCurrency[]>({
    method: 'GET',
    url: '/crypto/list',
  });
};

/**
 * 批量保存/更新数据（使用 CryptoCurrencyRequest 类型，不含 id）
 */
export const batchSaveCrypto = (data: CryptoCurrencyRequest[]) => {
  return requestWithRetry<{ code: number; message: string }>({
    method: 'POST',
    url: '/crypto/batch-save',
    data,
  });
};