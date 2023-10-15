import { Protocol } from 'config/router-sdk';
import { Currency, Percent, TradeType } from 'config/sdk-core';
import { Pair } from 'config/v2-sdk';
import { FeeAmount } from 'config/v3-sdk';

import useAutoRouterSupported from 'hooks/useAutoRouterSupported';
import React, { memo, useState } from 'react';
import { InterfaceTrade } from 'state/routing/types';
import styled from 'styled-components/macro';

import { AutoColumn } from 'components/Layout/Column';
import { PlusIcon } from 'svgs';
import { AutoRow, RowBetween, RowCenter } from 'components/Layout/Row';
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from 'config/constants/chains';
import { Trans } from 'react-i18next';
import Text from 'components/Text';
import RoutingDiagram from 'components/RoutingDiagram/RoutingDiagram';

import {useSelectedChainNetwork} from 'state/user/hooks';
import { AutoRouterLabel, AutoRouterLogo } from './RouterLabel';

const Wrapper = styled(AutoColumn)<{ darkMode?: boolean; fixedOpen?: boolean }>`
  padding: ${({ fixedOpen }) => (fixedOpen ? '12px' : '12px 8px 12px 12px')};
  border-radius: 16px;
  border: 1px solid ${({ theme, fixedOpen }) => (fixedOpen ? 'transparent' : theme.colors.background)};
  cursor: pointer;
`;

const OpenCloseIcon = styled(PlusIcon)<{ open?: boolean }>`
  margin-left: 8px;
  height: 20px;
  stroke-width: 2px;
  transition: transform 0.1s;
  transform: ${({ open }) => (open ? 'rotate(45deg)' : 'none')};
  stroke: ${({ theme }) => theme.colors.strokeAlt};
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

interface SwapRouteProps extends React.HTMLAttributes<HTMLDivElement> {
  trade: InterfaceTrade<Currency, Currency, TradeType>;
  syncing: boolean;
  fixedOpen?: boolean; // fixed in open state, hide open/close icon
}

const SwapRoute: React.FC<SwapRouteProps> = ({ trade, syncing, fixedOpen = false, ...rest }) => {
  const autoRouterSupported = useAutoRouterSupported();
  const routes = getTokenPath(trade);
  const [open, setOpen] = useState(false);

  const chainId = useSelectedChainNetwork();

  const formattedGasPriceString = trade?.gasUseEstimateUSD
    ? trade.gasUseEstimateUSD.toFixed(2) === '0.00'
      ? '<$0.01'
      : `$${trade.gasUseEstimateUSD.toFixed(2)}`
    : undefined;

  return (
    <Wrapper {...rest} fixedOpen={fixedOpen}>
      <RowBetween onClick={() => setOpen(!open)}>
        <AutoRow gap="4px" width="auto">
          <AutoRouterLogo />
          <AutoRouterLabel />
        </AutoRow>
        {fixedOpen ? null : <OpenCloseIcon open={open} />}
      </RowBetween>
      {/* <AnimatedDropdown open={open || fixedOpen}> */}
      <AutoRow gap="4px" width="auto" style={{ paddingTop: '12px', margin: 0 }}>
        {syncing ? (
          <RowCenter>
            <div style={{ width: '400px', height: '30px' }} />
          </RowCenter>
        ) : (
          <RoutingDiagram
            currencyIn={trade.inputAmount.currency}
            currencyOut={trade.outputAmount.currency}
            routes={routes}
          />
        )}

        {autoRouterSupported && (
          <>
            {syncing ? (
              <RowCenter>
                <div style={{ width: '250px', height: '15px' }} />
              </RowCenter>
            ) : (
              <Text fontSize="12px" width={400} margin={0}>
                {trade?.gasUseEstimateUSD && chainId && SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? (
                  <Trans>Best price route costs ~{formattedGasPriceString} in gas. </Trans>
                ) : null}{' '}
                <Trans>
                  This route optimizes your total output by considering split routes, multiple hops, and the gas cost of
                  each step.
                </Trans>
              </Text>
            )}
          </>
        )}
      </AutoRow>
      {/* </AnimatedDropdown> */}
    </Wrapper>
  );
};
export default memo(SwapRoute);
export interface RoutingDiagramEntry {
  percent: Percent;
  path: [Currency, Currency, FeeAmount][];
  protocol: Protocol;
}

const V2_DEFAULT_FEE_TIER = 3000;

/**
 * Loops through all routes on a trade and returns an array of diagram entries.
 */
export function getTokenPath(trade: InterfaceTrade<Currency, Currency, TradeType>): RoutingDiagramEntry[] {
  return trade.swaps.map(({ route: { path: tokenPath, pools, protocol }, inputAmount, outputAmount }) => {
    const portion =
      trade.tradeType === TradeType.EXACT_INPUT
        ? inputAmount.divide(trade.inputAmount)
        : outputAmount.divide(trade.outputAmount);
    const percent = new Percent(portion.numerator, portion.denominator);
    const path: RoutingDiagramEntry['path'] = [];
    for (let i = 0; i < pools.length; i++) {
      const nextPool = pools[i];
      const tokenIn = tokenPath[i];
      const tokenOut = tokenPath[i + 1];
      const entry: RoutingDiagramEntry['path'][0] = [
        tokenIn,
        tokenOut,
        nextPool instanceof Pair ? V2_DEFAULT_FEE_TIER : nextPool.fee,
      ];
      path.push(entry);
    }
    return {
      percent,
      path,
      protocol,
    };
  });
}
