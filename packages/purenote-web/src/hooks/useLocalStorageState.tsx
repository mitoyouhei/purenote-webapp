import { useState, useEffect } from "react";

export function useLocalStorageState(key: string, defaultValue: any) {
  const getInitialValue = () => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const [state, setState] = useState(getInitialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
