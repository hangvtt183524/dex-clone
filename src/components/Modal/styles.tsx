import React from 'react';
import styled, { keyframes } from 'styled-components';

import Flex from 'components/Box/Flex';
import IconButton from 'components/Button/IconButton';

import { ArrowLeftBackIcon, CloseIcon } from 'svgs';
import { RowMiddle } from 'components/Layout/Row';
import { Column } from 'components/Layout/Column';
import Heading from 'components/Heading';
import { ModalProps } from './types';

export const ModalHeader = styled(RowMiddle)<{ background?: string }>`
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-bottom: 24px;
  }
`;

export const ModalTitle = styled(Heading)`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const ModalBody = styled(Flex)`
  flex-direction: column;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ModalCloseButton: React.FC<{
  onDismiss: ModalProps['onDismiss'];
}> = ({ onDismiss }) => (
  <IconButton variant="subtle" onClick={onDismiss} aria-label="Close the dialog">
    <CloseIcon width={24} height={24} fill="#FFF" />
  </IconButton>
);

export const ModalBackButton: React.FC<{ onBack: ModalProps['onBack'] }> = ({ onBack }) => (
  <IconButton variant="subtle" onClick={onBack} area-label="go back">
    <ArrowLeftBackIcon color="#fff" fill="#fff" width="24px" />
  </IconButton>
);

const rise = keyframes`
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
`;

const riseMobile = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
`;

export const ModalContainer = styled(Column)`
  overflow: hidden;
  box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);

  max-height: 100vh;
  z-index: ${({ theme }) => theme.zIndices.modal};

  min-width: 320px;
  max-width: 100%;
  animation: ${riseMobile} 0.2s;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0;
    max-width: ${({ maxWidth }) => maxWidth};
    animation: ${rise} 0.2s;
  }
`;
