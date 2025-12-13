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
    // 处理常见错误
    if (error.message.includes('timeout')) {
      alert('请求超时，请检查后端服务是否正常！');
    } else if (error.message.includes('404')) {
      alert('接口不存在，请检查接口地址是否正确！');
    } else if (error.message.includes('500')) {
      alert('后端服务异常，请查看后端日志！');
    } else {
      alert('请求失败：' + error.message);
    }
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