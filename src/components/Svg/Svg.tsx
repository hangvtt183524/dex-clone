import styled, { DefaultTheme, css } from 'styled-components';
import { space } from 'styled-system';
import { getThemeValue } from 'styles/utils';
import { SvgProps } from './types';

interface ThemedProps extends SvgProps {
  theme: DefaultTheme;
}

const getColor = ({ color, theme }: ThemedProps & SvgProps) => {
  return getThemeValue(`colors.${color}`, color)(theme);
};

const Svg = styled.svg<SvgProps>`
  align-self: center; // Safari fix
  width: ${({ size, width }) => size || width};
  height: ${({ size, height }) => size || height};

  fill: ${getColor};

  ${({ pathFill, pathStroke }) =>
    (pathFill || pathStroke) &&
    css`
      path {
        fill: ${({ theme }) => getColor({ theme, color: pathFill })};
        stroke: ${({ theme }) => getColor({ theme, color: pathStroke })};
      }
    `}

  flex-shrink: 0;
  transform: ${({ transform, rotate }) => transform || `rotate(${rotate || '0deg'})`};

  ${space}
`;

Svg.defaultProps = {
  width: '20px',
  xmlns: 'http://www.w3.org/2000/svg',
  spin: false,
};

export default Svg;
