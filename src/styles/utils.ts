import { DefaultTheme } from 'styled-components';
import get from 'lodash/get';
import { ColorVariant, RadiusVariant, ShadowsVariant } from 'styles/types';

interface ThemedDefault {
  theme: DefaultTheme;
  color?: ColorVariant | string;
  background?: ColorVariant | string;
  radius?: RadiusVariant | string;
  shadow?: ShadowsVariant | string;
}

export const getThemeValue =
  (path: string, fallback?: string | number) =>
  (theme: DefaultTheme): string =>
    get(theme, path, fallback as string);

export const getColorTheme = ({ theme, color }: ThemedDefault) => getThemeValue(`colors.${color}`, color)(theme);
export const getBackgroundTheme = ({ background, theme }: ThemedDefault) =>
  getThemeValue(`colors.${background}`, background)(theme);

export const getShadowTheme = ({ shadow, theme }: ThemedDefault) => getThemeValue(`shadows.${shadow}`, shadow)(theme);
export const getRadiusTheme = ({ radius, theme }: ThemedDefault) => getThemeValue(`radius.${radius}`, radius)(theme);
