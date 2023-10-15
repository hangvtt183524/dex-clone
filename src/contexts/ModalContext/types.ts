import React from 'react';

export enum ModalPositionEnum {
  Bottom = 'bottom',
  Center = 'center',
}

export interface ModalsOptionsProps {
  modalId: string;
  data: any;
  position?: ModalPositionEnum;
  closeOnOverlayClick?: boolean;
}
export interface ModalsContextType {
  isOpen: boolean;
  nodeId: string;
  content: React.ReactNode;
  setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  onPresent: (node: React.ReactNode, options?: ModalsOptionsProps) => void;
  onDismiss: () => void;
}
