import React from 'react';

import ModalProvider from './ModalContext/Provider';
import ToastsProvider from './ToastContext/Provider';

interface ContextProviderProps {
  children: React.ReactNode;
}

const ContextProvider = ({ children }: ContextProviderProps) => {
  return (
    <ToastsProvider>
      <ModalProvider>{children}</ModalProvider>
    </ToastsProvider>
  );
};

export default ContextProvider;
