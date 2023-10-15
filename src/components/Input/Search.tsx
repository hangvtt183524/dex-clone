import { RowMiddle } from 'components/Layout/Row';
import React from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';
import { getBackgroundTheme } from 'styles/utils';
import { SearchIcon } from 'svgs';
import Input, { styleInputVariants } from './Input';
import { InputProps, Variant } from './types';

const StyledInput = styled(Input)<{ error?: boolean; variant: Variant }>`
  border: none;
  outline: none;
  background: transparent;
  height: auto;
  font-size: 14px;

  &:focus {
    border: none;
    outline: none;
  }

  padding: 0 14px 0 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 20px 0 14px;
  }
`;

const Wrapper = styled(RowMiddle)<{ background?: string; variant: Variant; iconSize?: string }>`
  border-radius: ${({ theme }) => theme.radius.small};

  padding: 14px 16px;
  width: 100%;
  min-width: auto;
  box-sizing: border-box;

  background: ${getBackgroundTheme};

  svg {
    width: ${({ iconSize }) => iconSize || '16px'};
    height: ${({ iconSize }) => iconSize || '16px'};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 12px 20px;
    svg {
      width: 24px;
      height: 24px;
    }
  }

  ${variant({
    prop: 'variant',
    variants: styleInputVariants,
  })}
`;

const Search = (
  {
    variant = 'primary',
    placeholder,
    onChange,
    iconSize,
    ...rest
  }: Omit<InputProps, 'ref'> & { iconSize?: string; background?: string },
  ref,
) => {
  return (
    <Wrapper iconSize={iconSize} variant={variant} {...rest}>
      <SearchIcon pathStroke="#FFF" />
      <StyledInput placeholder={placeholder} onChange={onChange} variant={variant} ref={ref} />
    </Wrapper>
  );
};

export default React.forwardRef(Search);
