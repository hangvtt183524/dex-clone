import styled from 'styled-components';
import { ButtonProps } from './types';
import Button from './Button';

const IconButton = styled(Button)<ButtonProps>`
  padding: 0;
  height: max-content;
  background: transparent !important;
`;

export default IconButton;
