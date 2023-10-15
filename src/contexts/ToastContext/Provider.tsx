import React, { createContext, useCallback, useMemo, useState } from 'react';
import kebabCase from 'lodash/kebabCase';
import { Toast, types as toastTypes } from 'components/Toast/types';
import { ToastContextApi } from './types';
import ToastListener from './Listener';

export const ToastsContext = createContext<ToastContextApi>(undefined);

interface ToastsProviderProps {
  children?: React.ReactNode;
}

const ToastsProvider: React.FC<ToastsProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastContextApi['toasts']>([]);

  const toast = useCallback(
    ({ title, description, type }: Omit<Toast, 'id'>) => {
      setToasts((prevToasts) => {
        const id = kebabCase(title);

        const currentToasts = prevToasts.filter((prevToast) => prevToast.id !== id);

        return [
          {
            id,
            title,
            description,
            type,
          },
          ...currentToasts,
        ];
      });
    },
    [setToasts],
  );

  const toastError = useCallback(
    (title: Toast['title'], description?: Toast['description']) =>
      toast({ title, description, type: toastTypes.DANGER }),
    [toast],
  );

  const toastInfo = useCallback(
    (title: Toast['title'], description?: Toast['description']) => toast({ title, description, type: toastTypes.INFO }),
    [toast],
  );
  const toastSuccess = useCallback(
    (title: Toast['title'], description?: Toast['description']) =>
      toast({ title, description, type: toastTypes.SUCCESS }),
    [toast],
  );
  const toastWarning = useCallback(
    (title: Toast['title'], description?: Toast['description']) =>
      toast({ title, description, type: toastTypes.WARNING }),
    [toast],
  );
  const clear = () => setToasts([]);
  const remove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id));
  };

  const renderMemoValue = useMemo(
    () => ({
      toasts,
      clear,
      remove,
      toastError,
      toastInfo,
      toastSuccess,
      toastWarning,
    }),
    [toastError, toastInfo, toastSuccess, toastWarning, toasts],
  );

  return (
    <ToastsContext.Provider value={renderMemoValue}>
      {children}
      <ToastListener />
    </ToastsContext.Provider>
  );
};

export default ToastsProvider;
