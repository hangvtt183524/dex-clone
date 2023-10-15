import Box from 'components/Box/Box';
import React from 'react';
import styled from 'styled-components';
import { CardProps } from './types';

const CardScrollOutner: React.FC<CardProps> = ({ children, ...props }) => (
  <StyledWrapperCardScrollOutner {...props}>{children}</StyledWrapperCardScrollOutner>
);

export const StyledWrapperCardScrollOutner = styled(Box)`
  overflow-y: scroll;
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.textSubtle};
  }
  &::-webkit-scrollbar-track {
    display: none;
    background: none;
  }

  padding-right: 16px;
  margin-right: -16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 24px;
    margin-right: -24px;
  }
`;

export default CardScrollOutner;
