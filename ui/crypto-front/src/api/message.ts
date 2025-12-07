import { requestWithRetry } from '../utils/axiosInstance';
import type { Message, MessageRequest } from '../types/message';

/**
 * 获取消息列表
 */
export const getMessages = (params?: MessageRequest) => {
  return requestWithRetry<Message[]>({
    method: 'GET',
    url: '/messages',
    params,
  });
};

/**
 * 根据ID获取消息详情
 */
export const getMessageById = (id: number) => {
  return requestWithRetry<Message>({
    method: 'GET',
    url: `/messages/${id}`,
  });
};

/**
 * 标记消息为已读
 */
export const markMessageAsRead = (id: number) => {
  return requestWithRetry<{ success: boolean }>({
    method: 'PUT',
    url: `/messages/${id}/read`,
  });
};
