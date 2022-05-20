import { AxiosError, AxiosResponse } from 'axios';
import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export function debounce<T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  wait: number
) {
  let timer: any;
  return (...args: T): Promise<U> => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(callback(...args)), wait);
    });
  };
}

export function useFirstRender() {
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}

const useRequest = <T, P = undefined>(
  callback: (signal: AbortSignal, payload?: P) => Promise<AxiosResponse<T>>,
  options?: {
    onSuccess?: (T) => void;
    onError?: (e: string) => void;
    dependencies?: DependencyList;
    runOnMount?: boolean;
    debounce?: number;
    payload?: P;
  }
) => {
  const [isLoading, setIsLoading] = useState(false);
  const firstRender = useFirstRender();
  const [error, setError] = useState('');
  const [data, setData] = useState<T>();
  const dependenciesRef = useRef<DependencyList>([]);
  const controller = new AbortController();
  const cancel = () => {
    controller.abort();
  };

  const run = async (payload?: P) => {
    let timeReminder = 400;
    const startTime = Date.now();
    setIsLoading(true);
    setError('');
    try {
      const { data } = await callback(controller.signal, payload);
      setData(data);
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      const msg =
        (error as AxiosError)?.response?.data?.message ||
        (error as Error).message;
      setError(msg);
      options?.onError?.(msg);
    } finally {
      timeReminder = Math.max(timeReminder, Date.now() - startTime);
      setTimeout(() => {
        setIsLoading(false);
      }, timeReminder);
    }
  };

  const runOnChange = useCallback(
    debounce(async (payload?: P) => {
      run(payload);
    }, options?.debounce || 0),
    [options?.debounce]
  );

  useEffect(() => {
    // run on dependency changes but not for the first time
    // don't run if nothing changed or undefined dependency given (this saves u from checking for existence of value in each request :)
    const hasUndefinedDependency = options?.dependencies?.some(
      (item) => item === undefined
    );
    const hasDependenciesChanged = options?.dependencies?.some((item, i) => {
      return dependenciesRef.current?.[i] !== item;
    });
    if (!hasDependenciesChanged || hasUndefinedDependency) {
      return;
    }
    runOnChange(options?.payload);
    dependenciesRef.current = options?.dependencies || [];
  }, options?.dependencies);

  useEffect(() => {
    // run once on mount
    if (options?.runOnMount) {
      run(options?.payload);
    }
  }, []);

  return { data, isLoading, error, run, cancel };
};

export default useRequest;
