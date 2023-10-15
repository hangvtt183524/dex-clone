import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import get from 'lodash/get';
import { ContextModal } from 'contexts/ModalContext/Provider';
import { ModalPositionEnum } from 'contexts/ModalContext/types';

const useModal = (
  modal: React.ReactNode | any,
  {
    closeOnOverlayClick = true,
    updateOnPropsChange = false,
    modalId = 'defaultNodeId',
    position = ModalPositionEnum.Center,
  },
): [<T = any>(data?: T) => void, () => void] => {
  const { isOpen, nodeId, content, setContent, onPresent, onDismiss } = useContext(ContextModal);

  const onPresentCallback = useCallback(
    <T = any>(data?: T) => {
      onPresent(modal, {
        modalId,
        data,
        position,
        closeOnOverlayClick,
      });
    },
    [onPresent, modal, modalId, position, closeOnOverlayClick],
  );

  const handleOnDismiss = useCallback(() => {
    if (nodeId === modalId) {
      onDismiss();
    }
  }, [modalId, nodeId, onDismiss]);

  useEffect(() => {
    if (updateOnPropsChange && isOpen && nodeId === modalId) {
      const modalProps = get(modal, 'props');
      const oldModalProps = get(content, 'props');

      if (modalProps && oldModalProps && JSON.stringify(modalProps) !== JSON.stringify(oldModalProps)) {
        setContent(modal);
      }
    }
  }, [updateOnPropsChange, nodeId, modalId, isOpen, modal, content, setContent]);

  return useMemo(() => [onPresentCallback, handleOnDismiss], [onPresentCallback, handleOnDismiss]);
};

export default useModal;
