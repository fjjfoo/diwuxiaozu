import { requestWithRetry } from '../utils/axiosInstance';
import type { Report, ReportRequest, ReportStatusUpdateRequest } from '../types/report';

/**
 * 获取报告列表
 */
export const getReports = (params?: ReportRequest) => {
  return requestWithRetry<Report[]>({
    method: 'GET',
    url: '/reports',
    params,
  });
};

/**
 * 根据ID获取报告详情
 */
export const getReportById = (id: number) => {
  return requestWithRetry<Report>({
    method: 'GET',
    url: `/reports/${id}`,
  });
};

/**
 * 更新报告状态
 */
export const updateReportStatus = (id: number, data: ReportStatusUpdateRequest) => {
  return requestWithRetry<{ success: boolean }>({
    method: 'PUT',
    url: `/reports/${id}/status`,
    data,
  });
};
