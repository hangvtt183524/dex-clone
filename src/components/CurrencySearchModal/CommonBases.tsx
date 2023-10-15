import styled from 'styled-components';
import useNativeCurrency from 'hooks/useNativeCurrency';
import { Box } from 'components/Box';
import Text from 'components/Text';
import { useTranslation } from 'react-i18next';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import { SUGGESTED_BASES } from 'config/constants/exchange';
import { SupportedChainId, Currency, Token } from 'config/sdk-core';
import React from 'react';
import { CommonBasesType } from './types';
import { AutoRow, RowMiddle } from '../Layout/Row';
import QuestionHelper from '../QuestionHelper';
import { AutoColumn } from '../Layout/Column';

const ButtonWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  width: fit-content;
`;

const BaseWrapper = styled(RowMiddle)<{ disable?: boolean }>`
  border: 1px solid ${({ disable, theme }) => (disable ? 'transparent' : theme.colors.strokeAlt)};
  padding: 6px;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background: ${({ theme, disable }) => !disable && theme.colors.background};
  }
  border-radius: ${({ theme }) => theme.radius.small};
  background: ${({ theme, disable }) => disable && theme.colors.backgroundAlt};
  opacity: ${({ disable }) => disable && '0.4'};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 8px 12px;
  }
`;

const StyledWrapListSuggesst = styled(AutoRow)`
  width: 100%;
  padding-bottom: 4px;
  overflow-x: scroll;
  flex-wrap: nowrap;

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.textSubtle};
  }
  &::-webkit-scrollbar-track {
    display: none;
    background: none;
  }
`;

const CommonBases = ({
  chainId,
  onSelect,
  selectedCurrency,
  otherSelectedCurrency,
  commonBasesType,
}: {
  chainId?: SupportedChainId;
  commonBasesType;
  selectedCurrency?: Currency | null;
  otherSelectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
}) => {
  const native = useNativeCurrency();
  const { t } = useTranslation();
  const pinTokenDescText = commonBasesType === CommonBasesType.SWAP_LIMITORDER ? t('Common tokens') : t('Common bases');

  return (
    <AutoColumn gap="sm">
      <Box mb="4px">
        <Text fontSize="14px" color="textAlt2">
          {pinTokenDescText}
        </Text>
        {commonBasesType === CommonBasesType.LIQUIDITY && (
          <QuestionHelper text={t('These tokens are commonly paired with other tokens.')} ml="4px" />
        )}
      </Box>
      <StyledWrapListSuggesst gap="8px">
        <ButtonWrapper>
          <BaseWrapper
            onClick={() => {
              if (!selectedCurrency || !selectedCurrency.isNative) {
                onSelect(native);
              }
            }}
            disable={selectedCurrency?.isNative || otherSelectedCurrency?.isNative}
          >
            <CurrencyLogo currency={native} style={{ marginRight: 8 }} />
            <Text scale="sm" fontWeight={500}>
              {native?.symbol}
            </Text>
          </BaseWrapper>
        </ButtonWrapper>
        {(chainId ? SUGGESTED_BASES[chainId] || [] : []).map((token: Token) => {
          if (!token) return;

          const selected =
            (token.isNative && selectedCurrency.isNative) ||
            (selectedCurrency && !selectedCurrency?.isNative &&
              (selectedCurrency as Token)?.address?.toLowerCase() === token.address?.toLowerCase()) ||
            (otherSelectedCurrency && !otherSelectedCurrency?.isNative &&
              (otherSelectedCurrency as Token)?.address?.toLowerCase() === token.address?.toLowerCase());

          return (
            token && (
              <ButtonWrapper key={`buttonBase#${token.address}`}>
                <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected}>
                  <CurrencyLogo currency={token} size={26} style={{ borderRadius: '50%' }} />
                  <Text scale="sm" fontWeight={400} ml="8px">
                    {token?.symbol}
                  </Text>
                </BaseWrapper>
              </ButtonWrapper>
            )
          );
        })}
      </StyledWrapListSuggesst>
    </AutoColumn>
  );
};

export default CommonBases;
