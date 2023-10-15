import { Breakpoints, BreakpointsMap, MediaQueries, Radius, Shadows, Transitions, ZIndexs } from './types';

// Media
export const breakpointMap: BreakpointsMap = {
  xs: 370,
  sm: 576,
  md: 852,
  lg: 968,
  xl: 1250,
  xxl: 1450,
  xxxl: 1650,
};

const breakpoints: Breakpoints = Object.values(breakpointMap).map((breakpoint) => `${breakpoint}px`);

const mediaQueries: MediaQueries = {
  xs: `@media screen and (min-width: ${breakpointMap.xs}px)`,
  sm: `@media screen and (min-width: ${breakpointMap.sm}px)`,
  md: `@media screen and (min-width: ${breakpointMap.md}px)`,
  lg: `@media screen and (min-width: ${breakpointMap.lg}px)`,
  xl: `@media screen and (min-width: ${breakpointMap.xl}px)`,
  xxl: `@media screen and (min-width: ${breakpointMap.xxl}px)`,
  xxxl: `@media screen and (min-width: ${breakpointMap.xxxl}px)`,
};

const zIndices: ZIndexs = {
  dropdown: 100,
  modal: 10000,
};

const radius: Radius = {
  tiny: '4px',
  small: '8px',
  medium: '12px',
  big: '16px',
  huge: '20px',
  extra: '24px',
};

const transitions: Transitions = {
  fast: 'all 0.2s',
  medium: 'all 0.5s',
};

const shadows: Shadows = {
  success: '0px 0px 0px 1px #31D0AA, 0px 0px 0px 4px rgba(49, 208, 170, 0.2)',
  warning: '0px 0px 0px 1px #ED4B9E, 0px 0px 0px 4px rgba(237, 75, 158, 0.2)',
  inset: 'inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1)',
  focus: '0px 0px 0px 1px #7645D9, 0px 0px 0px 4px rgba(118, 69, 217, 0.6)',
  normal: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  form: '0px 4px 4px rgba(0, 0, 0, 0.25), 0px 15px 10px rgba(0, 0, 0, 0.16)',
};

export default {
  siteWidth: 1328,
  topbarHeight: 70,
  bottombarHeight: 62,
  menuWidth: 243,
  menuWidthSmall: 80,

  breakpoints,
  shadows,
  mediaQueries,
  zIndices,
  radius,
  transitions,
};
