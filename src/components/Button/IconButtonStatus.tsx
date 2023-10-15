import styled, { css, keyframes } from 'styled-components';
import SuccessAniIcon from 'components/IconStatus/SuccessAniIcon';
import React, { useState } from 'react';
import { RowCenter } from 'components/Layout/Row';
import { ButtonProps } from './types';

const IconButtonStatus: React.FC<ButtonProps & { transparent?: boolean }> = ({ children, onClick, ...props }) => {
  const [active, setActive] = useState(false);

  const handleOnClick = (e) => {
    setActive(true);
    if (onClick) onClick(e);
    setTimeout(() => {
      setActive(false);
    }, 1000);
  };

  return (
    <StyledIconButtonBG {...props} onClick={handleOnClick}>
      {active ? (
        <StyledIconSuccess>
          <SuccessAniIcon size="16px" status="success" />
        </StyledIconSuccess>
      ) : (
        <StyledWrapChildren>{children}</StyledWrapChildren>
      )}
    </StyledIconButtonBG>
  );
};

const ChildrenKeyframe = keyframes`
	from {
    opacity: 1
    transform: scale(1)
  }
  to {
    opacity: 0
    transform: scale(0)
  }
`;

const IconKeyframe = keyframes`
	from {

    opacity: 0
    transform: scale(1)
  }
  to {
    opacity: 1
    transform: scale(1)
  }
`;

const StyledWrapChildren = styled(RowCenter)`
  background: transparent;
  animation: ${ChildrenKeyframe} 1s ease-in both;
`;
const StyledIconSuccess = styled(RowCenter)`
  background: transparent;
  animation: ${IconKeyframe} 1s ease-in both;
`;

const StyledIconButtonBG = styled(RowCenter)<{ transparent?: boolean }>`
  ${({ transparent }) =>
    transparent &&
    css`
      background: transparent;
      box-shadow: unset;
      border: unset;
      backdrop-filter: unset;
    `}
`;

export default IconButtonStatus;
