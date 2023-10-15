import { Box, BoxProps } from 'components/Box';
import styled from 'styled-components';
import React from 'react';

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  text-align: left;
`;

const ContentContainer = styled.div`
  min-height: 24px;
  display: flex;
  align-items: center;
`;

interface CellLayoutProps {
  label?: string;
}

const CellLayout: React.FC<React.PropsWithChildren<CellLayoutProps & BoxProps>> = ({
  label = '',
  children,
  ...props
}) => {
  return (
    <Box>
      {label && <Label>{label}</Label>}
      <ContentContainer {...props}>{children}</ContentContainer>
    </Box>
  );
};

export default CellLayout;
