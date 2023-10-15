import React from 'react';
import styled from 'styled-components';
import { CopyIcon } from 'svgs';
import { copyContent } from 'utils/copy';
import IconButtonStatus from './Button/IconButtonStatus';
import { RowFixed } from './Layout/Row';

interface Props {
  toCopy: string;
}

const StyleButton = styled(IconButtonStatus)`
  position: relative;
  display: flex;
  align-items: center;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  background: transparent;
  padding: 0;
  cursor: pointer;
  width: 24px;
`;

const CopyToClipboard: React.FC<React.PropsWithChildren<Props>> = ({ toCopy, children, ...props }) => {
  return (
    <RowFixed width="fit-content" flex="0">
      {children}
      <StyleButton width="20px" ml="4px" onClick={() => copyContent(toCopy)} {...props}>
        <CopyIcon width="20px" color="primary" />
      </StyleButton>
    </RowFixed>
  );
};

export default CopyToClipboard;
