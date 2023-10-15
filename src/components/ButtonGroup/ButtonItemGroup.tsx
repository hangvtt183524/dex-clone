import Button from 'components/Button/Button';
import { ButtonProps } from 'components/Button/types';
import React from 'react';

const ButtonItemGroup: React.FC<{ active?: boolean } & ButtonProps> = ({ active, ...props }) => {
  return <Button variant={active ? 'group-active' : 'group'} {...props} />;
};

export default ButtonItemGroup;
