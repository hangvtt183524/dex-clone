import Overlay from 'components/Overlay';
import React, { createContext, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ModalPositionEnum, ModalsContextType, ModalsOptionsProps } from './types';

type ModalPosition = (typeof ModalPositionEnum)[keyof typeof ModalPositionEnum];
type PositionPropsStyled = {
  position?: ModalPosition;
};

export type OptionsModalProps = PositionPropsStyled;

const ModalWrapper = styled.div<PositionPropsStyled>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${({ theme }) => theme.zIndices.modal};

  ${({ theme }) => theme.mediaQueries.sm} {
    top: 0;
  }
`;

export const ContextModal = createContext<ModalsContextType>({
  isOpen: false,
  nodeId: '',
  content: null,
  setContent: () => null,
  onPresent: () => {},
  onDismiss: () => {},
});

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>();
  const [nodeId, setNodeId] = useState('');
  const [closeOnOverlayClick, setCloseOnOverlayClick] = useState({});
  const [data, setData] = useState(null);
  const [positionModal, setPositionModal] = useState<ModalPositionEnum>(ModalPositionEnum.Center);

  const handlePresent = useCallback(
    (node: React.ReactNode, { modalId, data, position, closeOnOverlayClick }: ModalsOptionsProps) => {
      setData(data);
      setContent(node);
      setIsOpen(true);
      setNodeId(modalId);
      setCloseOnOverlayClick((preState) => ({
        ...preState,
        [modalId]: closeOnOverlayClick,
      }));
      if (position) {
        setPositionModal(position);
      }
    },
    [],
  );

  const handleDismiss = useCallback(() => {
    if (nodeId) {
      setContent(undefined);
      setIsOpen(false);
      setNodeId('');
      setCloseOnOverlayClick((preState) => ({
        ...preState,
        [nodeId]: false,
      }));
    }
  }, [nodeId]);

  const handleOverlayDismiss = useCallback(() => {
    if (closeOnOverlayClick[nodeId]) {
      handleDismiss();
    }
  }, [closeOnOverlayClick, handleDismiss, nodeId]);

  const valueProvider = useMemo(
    () => ({
      isOpen,
      nodeId,
      content,
      setContent,
      onPresent: handlePresent,
      onDismiss: handleDismiss,
    }),
    [isOpen, nodeId, content, setContent, handlePresent, handleDismiss],
  );

  return (
    <ContextModal.Provider value={valueProvider}>
      {isOpen && (
        <ModalWrapper position={positionModal}>
          <Overlay onClick={handleOverlayDismiss} />
          {React.isValidElement(content) &&
            (data
              ? React.cloneElement(content, {
                  onDismiss: handleDismiss,
                  data,
                } as any)
              : React.cloneElement(content, {
                  onDismiss: handleDismiss,
                } as any))}
        </ModalWrapper>
      )}
      {children}
    </ContextModal.Provider>
  );
};

export default ModalProvider;
