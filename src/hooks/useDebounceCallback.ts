import { useRef } from 'react';

const useDebounceCallback = () => {
  const debounceRef = useRef(null);

  const submit = (cb: (...prams: any[]) => void, debounceTime: number) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      cb();
    }, debounceTime);
  };

  return submit;
};

export default useDebounceCallback;
