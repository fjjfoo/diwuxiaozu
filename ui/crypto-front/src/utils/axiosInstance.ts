import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api', // 使用相对路径，配合vite代理配置
  timeout: 15000, // 超时时间：15秒，解决请求超时问题
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器（可选，添加日志）
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('请求地址：', config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器（统一错误处理）
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // 记录错误日志
    console.error('请求错误:', error);
    // 不在这里处理UI反馈，交给调用方处理
    return Promise.reject(error);
  }
);

// 带重试的请求函数（解决“最大重试次数0”问题）
export const requestWithRetry = async <T>(
  config: AxiosRequestConfig,
  retries = 2, // 重试2次
  delay = 1000 // 每次重试间隔1秒
): Promise<AxiosResponse<T>> => {
  try {
    return await axiosInstance(config);
  } catch (error) {
    if (retries > 0) {
      console.log(`请求失败，剩余重试次数：${retries}，1秒后重试...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return requestWithRetry<T>(config, retries - 1, delay);
    }
    throw error; // 重试次数耗尽，抛出错误
  }
};

export default axiosInstance;