export const formatDateTime = (date: string): string => {
  if (!date) return "";
  return new Date(date).toLocaleString();
};

export const extractText = (text: string, maxLength: number = 200): string => {
  if (!text) return "";
  return text.slice(0, maxLength);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>): ReturnType<T> => {
    clearTimeout(timeout);
    return new Promise((resolve) => {
      timeout = setTimeout(() => {
        resolve(func(...args));
      }, wait);
    }) as ReturnType<T>;
  }) as T;
};
