import useModal from 'hooks/useModal';
import React, { useMemo } from 'react';
import TransactionModal from './TransactionModal';

const useTransactionModal = () => {
  const [onPressentTransactionModal, onDismissTransactionModal] = useModal(<TransactionModal />, {
    modalId: 'Transaction-Modal',
  });

  return useMemo(
    () => ({
      onPressentTransactionModal,
      onDismissTransactionModal,
    }),
    [onDismissTransactionModal, onPressentTransactionModal],
  );
};

export default useTransactionModal;
