import { InputProps } from 'components/Input';
import styled from 'styled-components';
import { CheckboxProps, scales } from './types';

const getScale = ({ scale, size }: CheckboxProps) => {
  switch (scale) {
    case scales.SM:
      return '24px';
    case scales.MD:
    default:
      return size;
  }
};

const Checkbox: React.FC<Omit<InputProps, 'value' | 'scale'> & CheckboxProps> = styled.input.attrs({
  type: 'checkbox',
})`
  appearance: none;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: ${getScale};
  width: ${getScale};
  vertical-align: middle;
  transition: background-color 0.2s ease-in-out;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.small};

  background: rgba(255, 255, 255, 0.3);

  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid ${({ theme }) => theme.colors.stroke};

  &:after {
    content: '';
    position: absolute;
    border-bottom: 2px solid;
    border-left: 2px solid;
    border-color: transparent;
    top: 30%;
    left: 0;
    right: 0;
    width: 50%;
    height: 25%;
    margin: auto;
    transform: rotate(-50deg);
    transition: border-color 0.2s ease-in-out;
  }

  &:checked {
    border: none;
    background: ${({ theme }) => theme.colors.gradients.primary};
    &:after {
      border-color: white;
    }
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

Checkbox.defaultProps = {
  scale: scales.MD,
};

export default Checkbox;
