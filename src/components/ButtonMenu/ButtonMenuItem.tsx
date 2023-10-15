import Button from 'components/Button/Button';
import { BaseButtonProps, variants } from 'components/Button/types';
import React from 'react';
import styled from 'styled-components';
import { PolymorphicComponent } from 'utils/polymorphic';
import { ButtonMenuItemProps } from './types';

interface InactiveButtonProps extends BaseButtonProps {
  forwardedAs: BaseButtonProps['as'];
}

const ActiveButton = styled(Button).attrs({ variant: 'primary' })`
  border-radius: ${({ theme }) => theme.radius.tiny};
  font-size: 16px;
  font-weight: 500;
`;

// @ts-ignore
const InactiveButton: PolymorphicComponent<InactiveButtonProps, 'button'> = styled(ActiveButton)<InactiveButtonProps>`
  background: transparent !important;
  color: ${({ theme }) => theme.colors.textSubtle};

  &:hover:not(:disabled):not(:active) {
    background: transparent !important;
  }
`;

const ButtonMenuItem: PolymorphicComponent<ButtonMenuItemProps, 'button'> = ({
  isActive = false,
  variant = variants.PRIMARY,
  as,
  ...props
}: ButtonMenuItemProps) => {
  if (!isActive) {
    return <InactiveButton forwardedAs={as} variant={variant} {...props} />;
  }

  // @ts-ignore
  return <ActiveButton as={as} variant={variant} {...props} />;
};

export default ButtonMenuItem;
