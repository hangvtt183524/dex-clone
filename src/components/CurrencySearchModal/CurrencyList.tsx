import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { FixedSizeList } from 'react-window';
import QuestionHelper from 'components/QuestionHelper';
import useNativeCurrency from 'hooks/useNativeCurrency';
import { Currency, Token, CurrencyAmount } from 'config/sdk-core';
import Text from 'components/Text';
import { useTranslation } from 'react-i18next';
import { Column } from 'components/Layout/Column';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import { useCurrencyBalance } from 'hooks/useBalances';
import { isTokenOnList } from 'utils/tokens';
import { Card } from 'components/Card';
import IconButton from 'components/Button/IconButton';
import { FindIcon, StarActiveIcon, StarIcon } from 'svgs';
import { usePinTokens } from 'state/tokens/hooks';
import { useAppDispatch } from 'state/store';
import { updatePinToken } from 'state/user/actions';
import { getExplorerLink } from 'utils/getExplorer';
import Link from 'components/Link';
import { Box } from 'components/Box';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import { useAccount } from 'packages/wagmi/src';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import ImportRow from './ImportRow';
import CircleLoader from '../Loader/CircleLoaderMini';
import { RowFixed, RowBetween, AutoRow } from '../Layout/Row';
import { useIsUserAddedToken } from '../../hooks/Tokens';
import { useCombinedActiveList } from '../../state/lists/hooks';

const HEIGHT_ROW_CURRENCY = 64;
const HEIGHT_ROW_CURRENCY_MOBILE = 56;

function currencyKey(currency: Token): string {
  return currency?.isNative ? currency.symbol : currency.address;
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`;

const FixedContentRow = styled(Box)`
  padding: 4px 24px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
  height: ${HEIGHT_ROW_CURRENCY_MOBILE}px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: ${HEIGHT_ROW_CURRENCY}px;
  }
`;

const Balance = ({ balance }: { balance: CurrencyAmount<Currency> }) => {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>;
};

const MenuItem = styled(RowBetween)<{ disabled: boolean; selected: boolean }>`
  padding: 16px 12px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 8px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};

  :hover {
    background: ${({ theme }) => theme.colors.hover};
  }
  border-radius: ${({ theme }) => theme.radius.small};

  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`;

const CurrencyRow = ({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: Token;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
}) => {
  const { address, isConnected } = useAccount();
  const { chainId } = useActiveWeb3React();

  const { t } = useTranslation();
  const key = currencyKey(currency);
  const dispatch = useAppDispatch();
  const { isMobile } = useMatchBreakpoints();
  const selectedTokenList = useCombinedActiveList();
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency);
  const pinTokens = usePinTokens();
  const customAdded = useIsUserAddedToken(currency);
  const balance = useCurrencyBalance(address ?? undefined, currency);
  // only show add or remove buttons if not on selected list

  const isPinToken = pinTokens?.[chainId]?.[currency.address] || false;
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <CurrencyLogo currency={currency} size={32} />
      <Column width="70%">
        <AutoRow>
          {!isMobile && (
            <Text scale="md" fontWeight={500} ellipsis={1}>
              {currency.name}
            </Text>
          )}

          <Text scale="md" fontWeight={400} color={isMobile ? 'text' : 'textSubtle'} ml="4px">
            {currency?.symbol}
          </Text>

          {currency?.isNative && (
            <Text scale="xs" fontWeight={200} color={isMobile ? 'text' : 'textSubtle'} ml="4px">
                (native token)
            </Text>
          )}
        </AutoRow>
        {!isOnSelectedList && customAdded && (
          <Text color="textSubtle" ellipsis={1} fontSize="12px !important" mt="2px" maxWidth="200px">
            {`${t('Added by user')} •`}{' '}
          </Text>
        )}
      </Column>

      <RowFixed style={{ justifySelf: 'flex-end' }} gap="8px">
        {balance ? <Balance balance={balance} /> : isConnected ? <CircleLoader /> : null}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              updatePinToken({
                chainId,
                currencyId: currency.address,
                isPin: !isPinToken,
              }),
            );
          }}
        >
          {isPinToken ? <StarActiveIcon /> : <StarIcon />}
        </IconButton>
        <Link
          external
          href={getExplorerLink(currency.wrapped.address, 'token', chainId)}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <FindIcon />
        </Link>
      </RowFixed>
    </MenuItem>
  );
};

const CurrencyList = ({
  height,
  currencies,
  inactiveCurrencies,
  selectedCurrency,
  handleCurrencySelect,
  otherCurrency,
  fixedListRef,
  showBNB,
  showImportView,
  setImportToken,
  breakIndex,
}: {
  height: number | string;
  currencies: Currency[];
  inactiveCurrencies: Currency[];
  selectedCurrency?: Currency | null;
  handleCurrencySelect: (currency: Currency) => void;
  otherCurrency?: Currency | null;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
  showBNB: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
  breakIndex: number | undefined;
}) => {
  const native = useNativeCurrency();
  const { isMobile } = useMatchBreakpoints();

  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showBNB
      ? [native, ...currencies, ...inactiveCurrencies]
      : [...currencies, ...inactiveCurrencies];
    if (breakIndex !== undefined) {
      formatted = [...formatted.slice(0, breakIndex), undefined, ...formatted.slice(breakIndex, formatted.length)];
    }
    return formatted;
  }, [breakIndex, currencies, inactiveCurrencies, showBNB, native]);

  const { t } = useTranslation();

  const Row = useCallback(
    ({ data, index, style }) => {
      const token: Token = data[index];
      const isSelected = Boolean(
        selectedCurrency &&
          token &&
          ((token.isNative && selectedCurrency.isNative) ||
            (selectedCurrency as Token)?.address?.toLowerCase() === token.address?.toLowerCase()),
      );
      const otherSelected = Boolean(
        otherCurrency &&
          token &&
          ((token.isNative && otherCurrency.isNative) ||
            (otherCurrency as Token)?.address?.toLowerCase() === token.address?.toLowerCase()),
      );

      const handleSelect = () => handleCurrencySelect(token);

      const showImport = index > currencies.length;

      if (index === breakIndex || !data) {
        return (
          <FixedContentRow style={style}>
            <Card padding="8px 12px" borderRadius="8px">
              <RowBetween>
                <Text fontSize="12px">{t('Expanded results from inactive Token Lists')}</Text>
                <QuestionHelper
                  text={t(
                    // eslint-disable-next-line max-len, quotes, @typescript-eslint/quotes
                    "Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists.",
                  )}
                  ml="4px"
                />
              </RowBetween>
            </Card>
          </FixedContentRow>
        );
      }

      if (showImport && token) {
        return (
          <ImportRow style={style} token={token} showImportView={showImportView} setImportToken={setImportToken} dim />
        );
      }
      return (
        <CurrencyRow
          style={style}
          currency={token}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      );
    },
    [selectedCurrency, otherCurrency, currencies, breakIndex, handleCurrencySelect, t, showImportView, setImportToken],
  );

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), []);

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={isMobile ? HEIGHT_ROW_CURRENCY : HEIGHT_ROW_CURRENCY}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  );
};
export default CurrencyList;
