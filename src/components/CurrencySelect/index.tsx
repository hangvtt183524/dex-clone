import Button from 'components/Button';
import { ButtonProps } from 'components/Button/types';
import CurrencySearchModal from 'components/CurrencySearchModal/CurrencySearchModal';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import Text from 'components/Text';
import { Currency } from 'config/sdk-core';
import useModal from 'hooks/useModal';
import styled from 'styled-components';
import { DownIcon } from 'svgs';
import React from 'react';
import { RowFixed } from 'components/Layout/Row';

const CurrencySelect: React.FC<
  ButtonProps & {
    selectedToken?: Currency;
    otherSelectedToken?: Currency | null;
    showCommonBases?: boolean;
    commonBasesType?: string;
    handleCurrencySelect: (coin: Currency) => void;
  }
> = ({
  selectedToken,
  handleCurrencySelect,
  otherSelectedToken,
  showCommonBases,
  commonBasesType,
  className = 'select-token',
  ...props
}) => {
  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      handleCurrencySelect={handleCurrencySelect}
      selectedCurrency={selectedToken}
      otherSelectedCurrency={otherSelectedToken}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
    />,
    {
      modalId: 'currency-search-modal',
    },
  );
  return selectedToken ? (
    <Wrapper className={className} onClick={onPresentCurrencyModal} {...props}>
      <RowFixed>
        <CurrencyLogo style={{ borderRadius: '50%' }} currency={selectedToken} size={28} />
        <CurrencyText ml="8px" fontWeight={600}>
          {selectedToken?.symbol}
        </CurrencyText>
      </RowFixed>
      <DownIcon />
    </Wrapper>
  ) : (
    <ButtonSelectCoin onClick={onPresentCurrencyModal} {...props}>
      <CurrencyText>Select Token</CurrencyText>
      <DownIcon />
    </ButtonSelectCoin>
  );
};

const Wrapper = styled(Button)`
  padding: 0;
  background: transparent;
  border: 0;
`;

const CurrencyText = styled(Text).attrs({
  fontSize: '12px',
  fontWeight: 600,
  mr: '8px',
})`
  white-space: nowrap;
`;

const ButtonSelectCoin = styled(Button).attrs({ scale: 'sm' })`
  padding: 16px;
  margin-bottom: 6px;
`;

export default CurrencySelect;
