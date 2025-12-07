import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import type { AxiosRequestConfig } from 'axios';

interface UseAxiosResult<T = any> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useAxios = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): UseAxiosResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get<T>(url, config);
      setData(response.data);
    } catch (err) {
      setError(err as Error);
      console.error('API request failed:', err);
    } finally {
      setLoading(false);
    }
  }, [url, config]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
