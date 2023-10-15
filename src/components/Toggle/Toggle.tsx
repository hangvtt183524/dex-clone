import React from 'react';
import StyledToggle, { InputToggle, Handle } from './StyledToggle';
import { ToggleProps, scales } from './types';

const Toggle: React.FC<ToggleProps> = ({
  checked,
  defaultColor = 'disabled',
  checkedColor = 'primary',
  scale = scales.MD,
  onChange,
  ...props
}) => {
  const isChecked = !!checked;

  return (
    <StyledToggle
      $checked={isChecked}
      $checkedColor={checkedColor as any}
      $defaultColor={defaultColor as any}
      scale={scale}
    >
      <InputToggle
        value={isChecked as any}
        checked={isChecked}
        scale={scale}
        type="checkbox"
        onChange={() => onChange && onChange(!isChecked)}
        {...props}
      />
      <Handle $checked={isChecked} scale={scale} />
    </StyledToggle>
  );
};

export default Toggle;
