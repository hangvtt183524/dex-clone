import { Currency, Token } from 'config/sdk-core';
import React, { useMemo } from 'react';
import { getNativeLogoURI, getTokenLogoURI } from 'utils/getTokenLogo';
import Logo from '.';

const CurrencyLogo = ({
  currency,
  size = 24,
  style,
  ...props
}: {
  currency?: Currency;
  size?: number;
  style?: React.CSSProperties;
}) => {
  const srcs: string[] = useMemo(() => {
    const arr = [];
    if (currency?.isNative) {
      arr.push(getNativeLogoURI(currency.chainId));
    } else if (
      currency?.wrapped?.address &&
      getTokenLogoURI(currency?.wrapped?.address, currency?.chainId, 'uniswap')
    ) {
      arr.push(getTokenLogoURI(currency.wrapped.address, currency.chainId, 'uniswap'));
    }

    return arr;
  }, [currency]);

  return (
    <Logo
      {...props}
      size={size}
      srcs={srcs}
      alt={`${currency?.symbol ?? 'currency'} logo`}
      style={{
        ...style,
        borderRadius: '50%',
      }}
    />
  );
};
export default CurrencyLogo;
