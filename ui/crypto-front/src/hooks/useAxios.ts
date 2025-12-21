import { useState, useEffect, useCallback } from 'react';
import { requestWithRetry } from '../utils/axiosInstance';
import type { AxiosRequestConfig } from 'axios';

interface UseAxiosOptions extends AxiosRequestConfig {
  manual?: boolean;
}

interface UseAxiosResult<T = unknown> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: (newUrl?: string) => void;
}

export const useAxios = <T = unknown>(
  url: string,
  options?: UseAxiosOptions
): UseAxiosResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentUrl, setCurrentUrl] = useState(url);

  const fetchData = useCallback(async (fetchUrl?: string) => {
    const urlToUse = fetchUrl || currentUrl;
    setLoading(true);
    setError(null);
    
    try {
      const response = await requestWithRetry<T>({
        ...options,
        url: urlToUse,
        method: 'GET'
      });
      setData(response.data);
    } catch (err) {
      setError(err as Error);
      console.error('API request failed:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUrl, options]);

  useEffect(() => {
    setCurrentUrl(url);
  }, [url]);

  useEffect(() => {
    if (!options?.manual) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [fetchData, options?.manual]);

  const refetchWithNewUrl = useCallback((newUrl?: string) => {
    fetchData(newUrl);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: refetchWithNewUrl,
  };
};
