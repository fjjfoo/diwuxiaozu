import { requestWithRetry } from '../utils/axiosInstance';
import type { PortfolioItem, PortfolioHistory, PortfolioUpdateRequest, PortfolioHistoryRequest } from '../types/portfolio';

/**
 * 获取当前持仓
 */
export const getCurrentPortfolio = () => {
  return requestWithRetry<PortfolioItem[]>({
    method: 'GET',
    url: '/portfolio/current',
  });
};

/**
 * 获取持仓历史
 */
export const getPortfolioHistory = (params?: PortfolioHistoryRequest) => {
  return requestWithRetry<PortfolioHistory[]>({
    method: 'GET',
    url: '/portfolio/history',
    params,
  });
};

/**
 * 更新持仓
 */
export const updatePortfolio = (data: PortfolioUpdateRequest[]) => {
  return requestWithRetry<{ success: boolean }>({
    method: 'PUT',
    url: '/portfolio',
    data,
  });
};
