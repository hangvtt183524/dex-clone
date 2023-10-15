/* eslint-disable max-len */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import styled from 'styled-components';
import { ToggleProps, HandleProps, InputProps, ScaleKeys, scales, StyleToggleProps } from './types';

const scaleKeyValues = {
  md: {
    handleHeight: '30px',
    handleWidth: '42px',
    handleLeft: '2px',
    handleTop: '2px',
    checkedLeft: 'calc(100% - 44px)',
    toggleHeight: '34px',
    toggleWidth: '90px',
  },
  lg: {
    handleHeight: '36px',
    handleWidth: '50px',
    handleLeft: '2px',
    handleTop: '2px',
    checkedLeft: 'calc(100% - 52px)',
    toggleHeight: '40px',
    toggleWidth: '100px',
  },
};

const getScale =
  (property: ScaleKeys) =>
  ({ scale = scales.MD }: ToggleProps) =>
    scaleKeyValues[scale][property];

export const Handle = styled.div<HandleProps>`
  border-radius: ${({ theme }) => theme.radius.tiny};
  cursor: pointer;
  height: ${getScale('handleHeight')};
  width: ${getScale('handleWidth')};
  position: absolute;
  left: ${getScale('handleLeft')};
  top: ${getScale('handleTop')};
  transition: left 200ms ease-in;
  z-index: 1;
  display: flex;
  align-items: center;

  background: ${({ $checked, theme }) =>
    $checked
      ? theme.colors.gradients.primary
      : `linear-gradient(0deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)), rgba(8, 14, 23, 0.7)`};

  &:after {
    transition: 0;
    content: ${({ $checked }) => ($checked ? `'${'On'}'` : `'${'Off'}'`)};
    color: #fff;
    text-align: center;
    vertical-align: middle;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    margin: auto;
  }
`;

export const InputToggle = styled.input<Omit<InputProps, 'value'> & { value?: boolean }>`
  cursor: pointer;
  opacity: 0;
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 3;

  &:checked + ${Handle} {
    left: ${getScale('checkedLeft')};
  }
`;

const StyledToggle = styled.div<StyleToggleProps>`
  align-items: center;
  background: ${({ theme }) => theme.colors.toggle};
  border-radius: ${({ theme }) => theme.radius.tiny};

  cursor: pointer;
  display: inline-flex;
  height: ${getScale('toggleHeight')};
  position: relative;
  width: ${getScale('toggleWidth')};
  min-width: ${getScale('toggleWidth')};

  &:before {
    content: ${({ $checked }) => ($checked ? "'Off'" : '')};
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    margin-right: auto;

    display: flex;
    align-items: center;
    justify-content: center;

    height: ${getScale('handleHeight')};
    width: ${getScale('handleWidth')};
    transition: all 2s;
  }

  &:after {
    content: ${({ $checked }) => ($checked ? '' : "'On'")};
    color: ${({ theme }) => theme.colors.textSubtle};
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    margin-left: auto;

    display: flex;
    align-items: center;
    justify-content: center;

    height: ${getScale('handleHeight')};
    width: ${getScale('handleWidth')};
    transition: all 2s;
  }
`;

export default StyledToggle;
