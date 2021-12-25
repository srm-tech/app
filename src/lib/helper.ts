export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

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

export const getValidationMessage = (data) =>
  data.message ? data.message : `${data.errors[0].msg} ${data.errors[0].param}`;

export const handleError = (response, callback) => {
  if (response.status !== 200) {
    callback(getValidationMessage(response.data));
  }
};
