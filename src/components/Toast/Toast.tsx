import Alert from 'components/Alert';
import { variants } from 'components/Alert/types';
import Text from 'components/Text';
import React, { useCallback, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { ToastProps, types } from './types';

const alertTypeMap = {
  [types.INFO]: variants.INFO,
  [types.SUCCESS]: variants.SUCCESS,
  [types.DANGER]: variants.DANGER,
  [types.WARNING]: variants.WARNING,
};

const StyledToast = styled.div`
  right: 16px;
  position: fixed;
  max-width: calc(100% - 32px);
  transition: all 250ms ease-in;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 400px;
  }
`;

const Toast: React.FC<ToastProps> = ({ toast, onRemove, style, ttl, ...props }) => {
  const timer = useRef<number>();
  const ref = useRef(null);
  const removeHandler = useRef(onRemove);
  const { id, title, description, type } = toast;

  const handleRemove = useCallback(() => removeHandler.current(id), [id, removeHandler]);

  const handleMouseEnter = () => {
    clearTimeout(timer.current);
  };

  const handleMouseLeave = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      handleRemove();
    }, ttl);
  };

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      handleRemove();
    }, ttl);

    return () => {
      clearTimeout(timer.current);
    };
  }, [timer, ttl, handleRemove]);

  return (
    <CSSTransition nodeRef={ref} timeout={250} style={style} {...props}>
      <StyledToast ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Alert title={title} variant={alertTypeMap[type]} onClick={handleRemove}>
          <Text mt="4px" as="p">
            {description}
          </Text>
        </Alert>
      </StyledToast>
    </CSSTransition>
  );
};

export default Toast;
