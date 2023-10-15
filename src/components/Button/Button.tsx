import { RowMiddle } from 'components/Layout/Row';
import React, { cloneElement, ElementType, isValidElement } from 'react';
import RoboTheme from 'styles';
import StyledButton from './styles';
import { ButtonProps, scales, variants } from './types';

const Button = <E extends ElementType = 'button'>(props: Omit<ButtonProps<E>, 'ref'>, ref): JSX.Element => {
  const {
    external = false,
    className,
    isLoading = false,
    disabled = false,
    children,

    startIcon,

    endIcon,
    variant = variants.PRIMARY,
    scale = scales.MD,
    radius = RoboTheme.radius.small,
    ...rest
  } = props;

  const internalProps = external ? { target: '_blank' } : {};
  const isDisabled = isLoading || disabled;
  const classNames = className ? [className] : [];

  if (isLoading) {
    classNames.push('robo-button--loading');
  }

  if (isDisabled && !isLoading) {
    classNames.push('robo-button--disabled');
  }

  return (
    <StyledButton
      ref={ref}
      $isLoading={isLoading}
      className={classNames.join(' ')}
      disabled={isDisabled}
      variant={variant}
      scale={scale}
      radius={radius}
      {...internalProps}
      {...rest}
    >
      <>
        {isValidElement(startIcon) && (
          <RowMiddle mr="8px">
            {cloneElement(startIcon, {
              // @ts-ignore
              mr: '0.5rem',
            })}
          </RowMiddle>
        )}
        {children}
        {isValidElement(endIcon) && (
          <RowMiddle ml="8px">
            {cloneElement(endIcon, {
              // @ts-ignore
              mr: '0.5rem',
            })}
          </RowMiddle>
        )}
      </>
    </StyledButton>
  );
};

export default React.forwardRef(Button);
