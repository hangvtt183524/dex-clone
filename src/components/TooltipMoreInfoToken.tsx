import { RowFixed } from 'components/Layout/Row';
import Link from 'components/Link';
import { SupportedChainId } from 'config/sdk-core';
import React from 'react';
import styled from 'styled-components';
import { getExplorerLink } from 'utils/getExplorer';

const TooltipMoreInfoToken: React.FC<{ address: string; chainId: SupportedChainId }> = ({ address, chainId }) => {
  return (
    <StyledWrapper>
      <Link href={getExplorerLink(address, 'address', chainId)} external>
        View Contract
      </Link>
      {/* <Link href={getExplorerLink(address, 'address', chainId)} external>
        See Token Info
      </Link> */}
      {/* <Link href="/" external>
        View Project Site
      </Link> */}
    </StyledWrapper>
  );
};

const StyledWrapper = styled(RowFixed)`
  a {
    font-size: 12px;
    line-height: 18px;
    font-weight: 500;
    margin: 0 8px;
    white-space: nowrap;
    text-decoration: underline;

    &:nth-child(1) {
      color: ${({ theme }) => theme.colors.loading};
    }
  }
`;
export default TooltipMoreInfoToken;
