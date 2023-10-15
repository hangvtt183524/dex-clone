/* eslint-disable prefer-regex-literals */
import React from 'react';
import styled from 'styled-components';
import { checkNumberInput, escapeRegExp } from 'utils/regExpHelpers';
import Input from './Input';
import { InputProps } from './types';

const StyledInput = styled(Input)<{ error?: boolean }>`
  width: 0;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  font-size: 28px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  -webkit-appearance: textfield;
  text-align: ${({ align }) => align ?? 'left'};
  border-radius: 0;

  &:focus {
    border: none;
    outline: none;
  }
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }
`;

const NumericalInput = ({
  value,
  onUserInput,
  placeholder,
  fontSize,
  ...rest
}: {
  value: string | number;
  onUserInput: (input: string) => void;
  error?: boolean;
  align?: 'right' | 'left';
  fontSize?: string | string[];
  maxDecimals?: number;
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'> &
  Omit<InputProps, 'ref' | 'onChange' | 'as'>) => {
  const enforcer = (nextUserInput: string) => {
    // const inputRegex = new RegExp(`^\\d*(?:\\\\[.]\\d{0,${18}})?$`);

    if (nextUserInput === '' || checkNumberInput(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput);
    }
  };

  return (
    <StyledInput
      {...rest}
      value={value}
      onChange={(event) => {
        enforcer(event.target.value.replace(/,/g, '.'));
      }}
      inputMode="decimal"
      title="Token Amount"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || '0.00'}
      minLength={1}
      maxLength={79}
      spellCheck="false"
      fontSize={fontSize}
    />
  );
};

export default NumericalInput;
