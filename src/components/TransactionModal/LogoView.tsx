/* eslint-disable no-case-declarations */
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import { Native } from 'config/native';
import { TransactionInfo, TransactionType } from 'state/transactions/types';
import styled, { css } from 'styled-components/macro';

import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { findFarmByManagerAddressAndPid } from 'utils/farms';
import React from 'react';
import { useCurrency } from '../../hooks/Tokens';
import { useFarms } from '../../state/farms/hooks';

const CurrencyWrap = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
`;

const CurrencyWrapStyles = css`
  position: absolute;
  width: 24px;
  height: 24px;
`;

const CurrencyLogoWrap = styled.span<{ isCentered: boolean }>`
  ${CurrencyWrapStyles};
  left: ${({ isCentered }) => (isCentered ? '50%' : '0')};
  top: ${({ isCentered }) => (isCentered ? '50%' : '0')};
  transform: ${({ isCentered }) => isCentered && 'translate(-50%, -50%)'};
`;
const CurrencyLogoWrapTwo = styled.span`
  ${CurrencyWrapStyles};
  bottom: 0px;
  right: 0px;
`;

interface CurrencyPair {
  currencyId0: string | undefined;
  currencyId1: string | undefined;
}

const getCurrency = ({ info, chainId, pools }: { info: TransactionInfo; chainId: number | undefined, pools: any }): CurrencyPair => {
  switch (info.type) {
    case TransactionType.ADD_LIQUIDITY_V3_POOL:
    case TransactionType.REMOVE_LIQUIDITY_V3:
    case TransactionType.ADD_LIQUIDITY_V2_POOL:
    case TransactionType.CREATE_V3_POOL:
      const { baseCurrencyId, quoteCurrencyId } = info;
      return { currencyId0: baseCurrencyId, currencyId1: quoteCurrencyId };

    case TransactionType.APPROVAL_FARM:
    case TransactionType.STAKE_FARM:
    case TransactionType.UNSTAKE_FARM:
    case TransactionType.HARVEST_FARM:
      const { manager, pid } = info;
      const pool = findFarmByManagerAddressAndPid(pools, manager, pid);
      return { currencyId0: pool?.token.address, currencyId1: pool?.quoteToken.address };

    case TransactionType.SWAP:
      const { inputCurrencyId, outputCurrencyId } = info;
      return { currencyId0: inputCurrencyId, currencyId1: outputCurrencyId };
    case TransactionType.WRAP:
      const { unwrapped } = info;
      const native = info.chainId ? Native.onChain(info.chainId) : undefined;
      const base = 'ETH';
      const wrappedCurrency = native?.wrapped.address ?? 'WETH';
      return {
        currencyId0: unwrapped ? wrappedCurrency : base,
        currencyId1: unwrapped ? base : wrappedCurrency,
      };

    case TransactionType.APPROVAL:
      return { currencyId0: info.tokenAddress, currencyId1: undefined };

    default:
      return { currencyId0: undefined, currencyId1: undefined };
  }
};

const LogoView: React.FC<{ info: TransactionInfo }> = ({ info }) => {
  const { chainId } = useActiveWeb3React();
  const farms = useFarms();
  const pools = farms?.data;

  const { currencyId0, currencyId1 } = getCurrency({ info, chainId, pools });
  const currency0 = useCurrency(currencyId0);
  const currency1 = useCurrency(currencyId1);
  const isCentered = !(currency0 && currency1);

  return (
    <CurrencyWrap>
      <CurrencyLogoWrap isCentered={isCentered}>{currency0 && <CurrencyLogo currency={currency0} />}</CurrencyLogoWrap>
      {!isCentered && <CurrencyLogoWrapTwo>{currency1 && <CurrencyLogo currency={currency1} />}</CurrencyLogoWrapTwo>}
    </CurrencyWrap>
  );
};

export default LogoView;
