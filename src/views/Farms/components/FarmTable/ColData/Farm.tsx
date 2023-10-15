import { RowFixed, RowMiddle } from 'components/Layout/Row';
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo';
import Skeleton from 'components/Skeleton';
import Text from 'components/Text';
import useTooltip from 'hooks/useTooltip';
import React from 'react';
import styled from 'styled-components';
import TooltipMoreInfoToken from 'components/TooltipMoreInfoToken';
import { FarmProps } from '../../types';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  width: max-content;
`;

const Farm: React.FunctionComponent<React.PropsWithChildren<FarmProps>> = ({
  token,
  quoteToken,
  label,
  isReady,
  manager,
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <TooltipMoreInfoToken chainId={token.chainId} address={manager} />,
    {
      placement: 'top',
      trigger: 'hover',
      maxWidth: '340px !important',
      tooltipOffset: [0, 0],
    },
  );

  if (!isReady) {
    return (
      <RowMiddle>
        <RowFixed mr="8px">
          <Skeleton mr="-8px" width={28} height={28} variant="circle" />
          <Skeleton width={28} height={28} variant="circle" />
        </RowFixed>
        <Skeleton width={60} height={28} />
      </RowMiddle>
    );
  }

  return (
    <Container ref={targetRef}>
      <DoubleCurrencyLogo currency0={token} currency1={quoteToken} size={28} />
      <Text fontSize={['12px', '', '', '', '', '14px']} color="text" ml="4px">
        {label}
      </Text>

      {tooltipVisible && tooltip}
    </Container>
  );
};
export default Farm;
