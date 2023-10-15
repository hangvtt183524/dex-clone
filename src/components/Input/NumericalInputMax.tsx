import IconButton from 'components/Button/IconButton';
import { RowMiddle } from 'components/Layout/Row';
import Text from 'components/Text';
import React from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';
import { getRadiusTheme } from 'styles/utils';
import { RadiusVariant } from 'styles/types';
import { styleInputVariants } from './Input';
import NumericalInput from './NumericalInput';
import { InputProps, Variant } from './types';

const Wrapper = styled(RowMiddle)<{ variant?: Variant; radius?: RadiusVariant | string }>`
  padding: 14px 20px;
  border-radius: ${({ theme, radius }) => getRadiusTheme({ theme, radius }) || theme.radius.medium};

  ${variant({
    prop: 'variant',
    variants: styleInputVariants,
  })}
`;

const NumericalInputMax = ({
  value,
  onUserInput,
  onMax,
  placeholder,
  className,
  variant,
  radius,
  ...rest
}: {
  value: string | number;
  onUserInput: (input: string) => void;
  onMax?: (input: string) => void;
  error?: boolean;
  align?: 'right' | 'left';
  radius: RadiusVariant;
} & Omit<InputProps, 'ref' | 'onChange' | 'as'>) => {
  return (
    <Wrapper className={className} variant={variant} radius={radius}>
      <NumericalInput
        variant="transparent"
        fontSize="14px !important"
        value={value}
        onUserInput={onUserInput}
        placeholder={placeholder || '0.00'}
        {...rest}
      />
      <IconButton onClick={onMax}>
        <Text color="textSubtle">Max</Text>
      </IconButton>
    </Wrapper>
  );
};

export default NumericalInputMax;
