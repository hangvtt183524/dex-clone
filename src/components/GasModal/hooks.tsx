import { ModalPositionEnum } from 'contexts/ModalContext/types';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import useModal from 'hooks/useModal';
import React, { useMemo } from 'react';
import GasModal from './GasModal';

export const useGasModal = () => {
  const { isDesktop } = useMatchBreakpoints();

  const [onPresentGasModal, onDismissGasModal] = useModal(<GasModal />, {
    position: isDesktop ? ModalPositionEnum.Center : ModalPositionEnum.Bottom,
  });

  return useMemo(
    () => ({
      onPresentGasModal,
      onDismissGasModal,
    }),
    [onPresentGasModal, onDismissGasModal],
  );
};
