export type BreakpointsMap = {
  xs: number; // 370
  sm: number; // 576
  md: number; // 767
  lg: number; // 968
  xl: number; // 1080
  xxl: number; // 1200
  xxxl: number; // 1400
};

export type Breakpoints = string[];

export type MediaQueries = {
  xs: string; // 370
  sm: string; // 576
  md: string; // 767
  lg: string; // 968
  xl: string; // 1080
  xxl: string; // 1200
  xxxl: string; // 1400
};

type ColorBase = {
  primary: string;
  failure: string;
  success: string;
  warning: string;
  loading: string;
};

export type Shadows = {
  warning: string;
  success: string;
  inset: string;
  focus: string;
  normal: string;
  form: string;
};

export type Gradients = {
  primary: string;
  secondary: string;
  tertiary: string;

  disabled: string;
};

export type Colors = ColorBase & {
  background: string;
  backgroundAlt3: string;

  bgDisabled: string;
  input: string;

  textAlt: string;
  textAlt2: string;
  textAlt3: string;
  textAlt4: string;

  mark: string;

  stroke: string;
  strokeSec: string;
  strokeAlt: string;

  gradients: Gradients;

  base: string;
  form: string;
  formSecondary: string;
  panel: string;
  modal: string;
  earnFarm: string;
  topbar: string;
  cardGradient: string;

  inputPrimary: string;
  inputSecondary: string;
  inputTertiary: string;
  inputQuaternary: string;

  text: string;
  textPrimary: string;
  textSecondary: string;
  textSubtle: string;
  textDisabled: string;

  buttonDisabled: string;
  buttonMenu: string;
  buttonGroup: string;
  buttonGroupActive: string;
  toggleActive: string;
  toggle: string;

  select: string;
  hover: string;
  tooltip: string;
  backgroundAlt: string;
  activeTabMenu: string;
};

export type ZIndexs = {
  dropdown: number;
  modal: number;
};

export type Transitions = {
  fast: string;
  medium: string;
};

export type Radius = {
  tiny: string;
  small: string;
  medium: string;
  big: string;
  huge: string;
  extra: string;
};

export interface RoboTheme {
  siteWidth: number;
  topbarHeight: number;
  bottombarHeight: number;
  menuWidth: number;
  menuWidthSmall: number;

  breakpoints: Breakpoints;
  mediaQueries: MediaQueries;
  colors: Colors;
  zIndices: ZIndexs;
  shadows: Shadows;
  transitions: Transitions;
  radius: Radius;
}

export type ColorVariant = keyof Colors;
export type RadiusVariant = keyof Radius;
export type ShadowsVariant = keyof Shadows;
