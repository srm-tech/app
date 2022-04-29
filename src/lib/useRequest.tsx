import { AxiosError, AxiosResponse } from 'axios';
import { DependencyList, useEffect, useState } from 'react';

const useRequest = <T extends any>(
  callback: ({ signal: AbortController }) => Promise<AxiosResponse<T>>,
  dependencies?: DependencyList
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<T>();
  const controller = new AbortController();
  const cancel = () => {
    controller.abort();
  };
  const run = async () => {
    setIsLoading(true);
    try {
      const { data } = await callback({ signal: controller.signal });
      setData(data);
      return data;
    } catch (error) {
      setError(
        (error as AxiosError)?.response?.data?.message ||
          (error as Error).message
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dependencies?.length) {
      run();
    }
  }, dependencies);

  return { data, isLoading, error, run, cancel };
};

export default useRequest;
