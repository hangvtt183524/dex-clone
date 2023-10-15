import styled from 'styled-components';
import { getRadiusTheme } from 'styles/utils';
import { ButtonProps } from './types';
import Button from './Button';

const IconButtonBG = styled(Button)<ButtonProps>`
  width: 34px;
  height: 34px;

  padding: 6px;

  border-radius: ${({ theme, radius }) => getRadiusTheme({ theme, radius }) || theme.radius.medium};
  box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);

  width: auto;
  height: auto;
  box-sizing: border-box;

  svg,
  img {
    min-width: auto;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 42px;
    height: 42px;
  }
`;

IconButtonBG.defaultProps = {
  variant: 'icon-button',
};

export default IconButtonBG;
