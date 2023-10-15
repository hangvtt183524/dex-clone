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

const CurrencySelectFull: React.FC<
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
        <CurrencyText ml="6px ">{selectedToken?.symbol}</CurrencyText>
      </RowFixed>
      <DownIcon />
    </Wrapper>
  ) : (
    <Wrapper onClick={onPresentCurrencyModal} {...props}>
      <CurrencyText>Select Token</CurrencyText>
      <DownIcon />
    </Wrapper>
  );
};

const Wrapper = styled(Button)`
  padding: 0;
  background: transparent;
  border: 0;
  width: 100%;
  padding: 20px;
  background: ${({ theme }) => theme.colors.inputSecondary};
  justify-content: space-between;
  height: 60px;
  border-radius: ${({ theme }) => theme.radius.medium};
`;

const CurrencyText = styled(Text).attrs({
  fontSize: '14px',
  fontWeight: 600,
  mr: '8px',
})`
  white-space: nowrap;
`;

export default CurrencySelectFull;
