import { requestWithRetry } from '../utils/axiosInstance';
import type { SystemOverview } from '../types/system';

/**
 * 获取系统概览数据
 */
export const getSystemOverview = () => {
  return requestWithRetry<SystemOverview>({
    method: 'GET',
    url: '/system/overview',
  });
};