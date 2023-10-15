/* eslint-disable max-len */
import { Colors } from './types';

export const urlBgCardGrain = '/assets/images/grain.svg';

const baseColors = {
  primary: '#39D0D8',
  failure: 'rgb(255, 99, 112)',
  success: '#00DF68',
  warning: '#DD6B20',
  loading: '#0096F2',
};

const colors: Colors = {
  ...baseColors,
  background: '#1A1B23',
  backgroundAlt3: '#718096',

  bgDisabled: '#3B3C4E',
  input: '#212935',

  stroke: '#313640',
  strokeSec: '#353B47',
  strokeAlt: '#343a42',

  mark: '#15F8C1',

  gradients: {
    primary:
      'linear-gradient(0deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08)), linear-gradient(91.27deg, #0096F2 -1.47%, #7AE6F4 100%)',
    secondary: `url(${urlBgCardGrain}) , linear-gradient(180deg, rgba(52, 58, 66, 0.2) 0%, rgba(52, 58, 66, 0.2) 100%)`,
    tertiary: `url(${urlBgCardGrain}) , linear-gradient(93.29deg, rgba(52, 58, 66, 0.2) 0%, rgba(52, 58, 66, 0.2) 105.09%)`,
    disabled: `url(${urlBgCardGrain}), linear-gradient(180deg, rgba(52, 58, 66, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)`,
  },
  base: '#131217',
  form: 'linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), rgba(13, 14, 16, 0.9)',
  formSecondary: 'linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #0D0E10',

  panel: 'rgba(255, 255, 255, 0.08)',
  modal: 'linear-gradient(0deg, rgba(200, 204, 209, 0.08), rgba(200, 204, 209, 0.08)), #080E17',
  earnFarm: '#0f0e15',
  topbar: '#0D0E10',
  cardGradient: 'linear-gradient(177.36deg, #3a92e2 2.21%, rgba(111, 180, 199, 0) 79.07%);',

  inputPrimary: 'linear-gradient(0deg, rgba(230, 230, 230, 0.16), rgba(230, 230, 230, 0.16)), #080E17',
  inputSecondary: `url(${urlBgCardGrain}), linear-gradient(96.73deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.025) 80%)`,
  inputTertiary: 'linear-gradient(0deg, rgba(230, 230, 230, 0.08), rgba(230, 230, 230, 0.08)), #080E17',
  inputQuaternary: 'linear-gradient(0deg, rgba(230, 230, 230, 0.08), rgba(230, 230, 230, 0.08)), #131217',

  text: '#FFF',
  textPrimary: '#47DEFF',
  textSecondary: '#E2E8F0',
  textSubtle: '#B7BDC6',
  textDisabled: 'rgba(173, 192, 209, 0.5)',

  textAlt: '#ACE3E5',
  textAlt2: '#EDF2F7',
  textAlt3: '#718096',
  textAlt4: '#AEAEBA',

  buttonDisabled: `url(${urlBgCardGrain}), linear-gradient(180deg, rgba(52, 58, 66, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)`,
  buttonMenu: 'linear-gradient(0deg, rgba(230, 230, 230, 0.16), rgba(230, 230, 230, 0.16)), #080E17',
  buttonGroup: `url(${urlBgCardGrain}), linear-gradient(96.73deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 99%)`,
  buttonGroupActive: `url(${urlBgCardGrain}), linear-gradient(96.73deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.28) 99%)`,

  toggle: 'rgba(255, 255, 255, 0.1)',
  toggleActive: 'linear-gradient(0deg, rgba(230, 230, 230, 0.15), rgba(230, 230, 230, 0.15)), #080E17',

  select: 'rgba(255, 255, 255, 0.08)',
  hover: 'linear-gradient(0deg, rgba(200, 204, 209, 0.2), rgba(200, 204, 209, 0.2)), #080E17',
  tooltip: 'linear-gradient(0deg, rgba(200, 204, 209, 0.2), rgba(200, 204, 209, 0.2)), #080E17',
  backgroundAlt: 'linear-gradient(0deg, rgba(230, 230, 230, 0.13), rgba(230, 230, 230, 0.13)), #080E17',
  activeTabMenu: `url(${urlBgCardGrain}), linear-gradient(104.79deg, rgba(52, 58, 66, 0.4) 0%, rgba(52, 58, 66, 0.4) 100%)`,
};

export default {
  ...colors,
};
