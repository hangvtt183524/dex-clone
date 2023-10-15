import { Box, BoxProps } from 'components/Box';
import { Currency } from 'config/sdk-core';
import styled from 'styled-components';
import React from 'react';
import CurrencyLogo from './CurrencyLogo';

const Wrapper = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: row;
  width: max-content;
`;

interface DoubleCurrencyLogoProps extends BoxProps {
  size?: number;
  currency0?: Currency;
  currency1?: Currency;
}

const DoubleCurrencyLogo = ({ currency0, currency1, size = 16, ...props }: DoubleCurrencyLogoProps) => {
  return (
    <Wrapper {...props}>
      {currency0 && <CurrencyLogo currency={currency0} size={size} />}
      {currency1 && (
        <CurrencyLogo
          style={{
            transform: 'translateX(-40%)',
            zIndex: 1,
          }}
          currency={currency1}
          size={size}
        />
      )}
    </Wrapper>
  );
};

export default DoubleCurrencyLogo;
