import { RowFixed } from 'components/Layout/Row';
import { Currency, TradeType } from 'config/sdk-core';
import React from 'react';
import { InterfaceTrade } from 'state/routing/types';
import styled from 'styled-components/macro';
import { GasIcon } from 'svgs';

const GasWrapper = styled(RowFixed)`
  border-radius: 8px;
  padding: 4px 6px;
  height: 24px;
  color: ${({ theme }) => theme.colors.textSubtle};
  background-color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  font-weight: 500;
  user-select: none;
`;
const StyledGasIcon = styled(GasIcon)`
  margin-right: 4px;
  height: 14px;
  & > * {
    stroke: ${({ theme }) => theme.colors.textSubtle};
  }
`;

const GasEstimateBadge = ({
  // loading,
  // showRoute,
  // disableHover,
  trade,
}: {
  trade: InterfaceTrade<Currency, Currency, TradeType> | undefined | null; // dollar amount in active chain's stablecoin
  loading: boolean;
  showRoute?: boolean; // show route instead of gas estimation summary
  disableHover?: boolean;
}) => {
  const formattedGasPriceString = trade?.gasUseEstimateUSD
    ? trade.gasUseEstimateUSD.toFixed(2) === '0.00'
      ? '<$0.01'
      : `$${trade.gasUseEstimateUSD.toFixed(2)}`
    : undefined;

  return (
    // <MouseoverTooltipContent
    //   wrap={false}
    //   disableHover={disableHover}
    //   content={
    //     loading ? null : (
    //       <ResponsiveTooltipContainer
    //         origin="top right"
    //         style={{
    //           padding: showRoute ? "0" : "12px",
    //           border: "none",
    //           borderRadius: showRoute ? "16px" : "12px",
    //           maxWidth: "400px"
    //         }}>
    //         {showRoute ? (
    //           trade ? (
    //             <SwapRoute trade={trade} syncing={loading} fixedOpen={showRoute} />
    //           ) : null
    //         ) : (
    //           <AutoColumn gap="4px" justify="center">
    //             <ThemedText.DeprecatedMain fontSize="12px" textAlign="center">
    //               <Trans>Estimated network fee</Trans>
    //             </ThemedText.DeprecatedMain>
    //             <ThemedText.DeprecatedBody textAlign="center" fontWeight={500} style={{ userSelect: "none" }}>
    //               <Trans>${trade?.gasUseEstimateUSD?.toFixed(2)}</Trans>
    //             </ThemedText.DeprecatedBody>
    //             <ThemedText.DeprecatedMain fontSize="10px" textAlign="center" maxWidth="140px" color="text3">
    //               <Trans>Estimate may differ due to your wallet gas settings</Trans>
    //             </ThemedText.DeprecatedMain>
    //           </AutoColumn>
    //         )}
    //       </ResponsiveTooltipContainer>
    //     )
    //   }
    //   placement="bottom"
    //   onOpen={() =>
    //     sendEvent({
    //       category: "Gas",
    //       action: "Gas Details Tooltip Open"
    //     })
    //   }>
    //   <LoadingOpacityContainer $loading={loading}>
    //     <GasWrapper>
    //       <StyledGasIcon />
    //       {formattedGasPriceString ?? null}
    //     </GasWrapper>
    //   </LoadingOpacityContainer>
    // </MouseoverTooltipContent>

    <GasWrapper>
      <StyledGasIcon />
      {formattedGasPriceString ?? null}
    </GasWrapper>
  );
};
export default GasEstimateBadge;
