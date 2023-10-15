import React from 'react';
import { Card } from 'components/Card';
import Text from 'components/Text';
import RoboTheme from 'styles';
import { ModalProps } from './types';
import { ModalBody, ModalHeader, ModalTitle, ModalContainer, ModalCloseButton, ModalBackButton } from './styles';

const Modal: React.FC<ModalProps> = ({
  title,
  onDismiss,
  onBack,
  children,
  closeButton = true,
  minWidth = '390px',
  bodyPadding,
  bodyMaxHeight = '70vh',
  centerTitle = false,
  styleBody,
  ...props
}) => (
  <ModalContainer minWidth={minWidth} {...props}>
    <Card className="card-at-modal" style={{ background: RoboTheme.colors.modal }}>
      <ModalHeader className="modal-header">
        <ModalTitle scale="md" style={{ justifyContent: centerTitle ? 'space-between' : '' }}>
          {onBack ? <ModalBackButton onBack={onBack} /> : <div />}
          <Text fontSize="16px" fontWeight="600" m={onBack ? '0 auto' : '0'}>
            {title}
          </Text>
          <div />
        </ModalTitle>
        {closeButton && <ModalCloseButton onDismiss={onDismiss} />}
      </ModalHeader>
      <ModalBody p={bodyPadding} style={{ maxHeight: bodyMaxHeight, ...styleBody }}>
        {children}
      </ModalBody>
    </Card>
  </ModalContainer>
);

export default Modal;
