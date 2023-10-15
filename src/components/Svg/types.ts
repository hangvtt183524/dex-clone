import { SVGAttributes } from 'react';
import { SpaceProps } from 'styled-system';

export interface SvgProps extends SVGAttributes<HTMLOrSVGElement>, SpaceProps {
  spin?: boolean;
  rotate?: string;
  color?: string;
  size?: string;
  fill?: string | null;
  pathFill?: string | null;
  pathStroke?: string | null;
}
