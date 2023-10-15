/* eslint-disable react/no-array-index-key */
import { Protocol } from 'config/router-sdk';
import { Currency } from 'config/sdk-core';
import { FeeAmount } from 'config/v3-sdk';
import Badge from 'components/Badge';
import { Box } from 'components/Box';
import { Row, AutoRow } from 'components/Layout/Row';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo';
import Text from 'components/Text';
import { useTokenInfoFromActiveList } from 'hooks/Tokens';
import useTooltip from 'hooks/useTooltip';
import { Trans } from 'react-i18next';
import styled from 'styled-components/macro';
import { DotLineIcon } from 'svgs';
import { RoutingDiagramEntry } from 'views/Swap/components/SwapRoute';
import React from 'react';

const Wrapper = styled(Box)`
  align-items: center;
  width: 100%;
`;

const RouteContainerRow = styled(Row)`
  display: grid;
  grid-template-columns: 24px 1fr 24px;
`;

const RouteRow = styled(Row)`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 0.1rem 0.5rem;
  position: relative;
`;

const PoolBadge = styled(Badge)`
  display: flex;
  padding: 4px 4px;
`;

const DottedLine = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  width: calc(100%);
  z-index: 1;
  opacity: 0.5;
`;

const DotColor = styled(DotLineIcon)`
  path {
    stroke: ${({ theme }) => theme.colors.textSubtle};
  }
`;

const OpaqueBadge = styled(Badge)`
  background-color: ${({ theme }) => theme.colors.textSubtle};
  border-radius: 8px;
  display: grid;
  font-size: 12px;
  grid-gap: 4px;
  grid-auto-flow: column;
  justify-content: start;
  padding: 4px 6px 4px 4px;
  z-index: ${({ theme }) => theme.zIndices.modal};
`;

const ProtocolBadge = styled(Badge)`
  background-color: ${({ theme }) => theme.colors.textSubtle};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 10px;
  padding: 2px 4px;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`;

const MixedProtocolBadge = styled(ProtocolBadge)`
  width: 60px;
`;

const BadgeText = styled(Text)`
  word-break: normal;
`;

const RoutingDiagram = ({
  currencyIn,
  currencyOut,
  routes,
}: {
  currencyIn: Currency;
  currencyOut: Currency;
  routes: RoutingDiagramEntry[];
}) => {
  const tokenIn = useTokenInfoFromActiveList(currencyIn);
  const tokenOut = useTokenInfoFromActiveList(currencyOut);

  return (
    <Wrapper>
      {routes.map((entry, i) => (
        <RouteContainerRow key={`${i}route`}>
          <CurrencyLogo currency={tokenIn} size={20} />
          <Route entry={entry} />
          <CurrencyLogo currency={tokenOut} size={20} />
        </RouteContainerRow>
      ))}
    </Wrapper>
  );
};
export default RoutingDiagram;
const Route = ({ entry: { percent, path, protocol } }: { entry: RoutingDiagramEntry }) => {
  return (
    <RouteRow>
      <DottedLine>
        <DotColor />
      </DottedLine>
      <OpaqueBadge>
        {protocol === Protocol.MIXED ? (
          <MixedProtocolBadge>
            <BadgeText fontSize="12px">V3 + V2</BadgeText>
          </MixedProtocolBadge>
        ) : (
          <ProtocolBadge>
            <BadgeText fontSize="12px">{protocol.toUpperCase()}</BadgeText>
          </ProtocolBadge>
        )}
        <BadgeText fontSize="14px" style={{ minWidth: 'auto' }}>
          {percent.toSignificant(2)}%
        </BadgeText>
      </OpaqueBadge>
      <AutoRow gap="1px" width="100%" style={{ justifyContent: 'space-evenly', zIndex: 2 }}>
        {path.map(([currency0, currency1, feeAmount], index) => (
          <Pool key={index} currency0={currency0} currency1={currency1} feeAmount={feeAmount} />
        ))}
      </AutoRow>
    </RouteRow>
  );
};

const Pool = ({
  currency0,
  currency1,
  feeAmount,
}: {
  currency0: Currency;
  currency1: Currency;
  feeAmount: FeeAmount;
}) => {
  const tokenInfo0 = useTokenInfoFromActiveList(currency0);
  const tokenInfo1 = useTokenInfoFromActiveList(currency1);
  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <Trans>{`${tokenInfo0?.symbol}/${tokenInfo1?.symbol} ${feeAmount / 10000}`}% pool</Trans>,
    { trigger: 'hover' },
  );
  // TODO - link pool icon to info.uniswap.org via query params
  return (
    <PoolBadge ref={targetRef}>
      <Box margin="0 4px 0 12px">
        <DoubleCurrencyLogo currency0={tokenInfo1} currency1={tokenInfo0} size={20} />
      </Box>
      <Text fontSize="14px">{feeAmount / 10000}%</Text>
      {tooltipVisible && tooltip}
    </PoolBadge>
  );
};
