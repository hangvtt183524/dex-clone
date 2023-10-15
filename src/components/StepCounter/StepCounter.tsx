import { Box } from 'components/Box';
import IconButtonBG from 'components/Button/IconButtonBG';
import NumericalInput from 'components/Input/NumericalInput';
import { AutoColumn } from 'components/Layout/Column';
import Text from 'components/Text';
import { FeeAmount } from 'config/pair';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { MinusIcon, PlusIcon } from 'svgs';

const pulse = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${color};
  }

  70% {
    box-shadow: 0 0 0 2px ${color};
  }

  100% {
    box-shadow: 0 0 0 0 ${color};
  }
`;

const InputRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 30px 1fr 30px;
`;

const FocusedOutlineCard = styled(Box)<{ active?: boolean; pulsing?: boolean }>`
  border: 2px solid ${({ theme }) => theme.colors.stroke};
  padding: 12px;
  animation: ${({ pulsing, theme }) => pulsing && pulse(theme.colors.stroke)} 0.8s linear;
  border-radius: ${({ theme }) => theme.radius.small};

  ${IconButtonBG} {
    width: 30px;
    height: 30px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const StyledInput = styled(NumericalInput)<{ usePercent?: boolean }>`
  background-color: transparent;
  text-align: center;
  width: 100%;
  font-weight: 500;
  padding: 0 10px;
  font-size: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 20px;
  }
`;

interface StepCounterProps {
  value: string;
  onUserInput: (value: string) => void;
  decrement: () => string;
  increment: () => string;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  feeAmount?: FeeAmount;
  label?: string;
  width?: string;
  locked?: boolean; // disable input
  title: ReactNode;
  tokenA: string | undefined;
  tokenB: string | undefined;
}

const StepCounter = ({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  incrementDisabled = false,
  width,
  locked,
  onUserInput,
  title,
  tokenA,
  tokenB,
}: StepCounterProps) => {
  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false);

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('');
  const [useLocalValue, setUseLocalValue] = useState(false);

  // animation if parent value updates local value
  const [pulsing, setPulsing] = useState<boolean>(false);

  const handleOnFocus = () => {
    setUseLocalValue(true);
    setActive(true);
  };

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false);
    setActive(false);
    onUserInput(localValue); // trigger update on parent value
  }, [localValue, onUserInput]);

  // for button clicks
  const handleDecrement = useCallback(() => {
    setUseLocalValue(false);
    onUserInput(decrement());
  }, [decrement, onUserInput]);

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false);
    onUserInput(increment());
  }, [increment, onUserInput]);

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value); // reset local value to match parent
        setPulsing(true); // trigger animation
        setTimeout(() => {
          setPulsing(false);
        }, 1800);
      }, 0);
    }
  }, [localValue, useLocalValue, value]);

  return (
    <FocusedOutlineCard pulsing={pulsing} active={active} onFocus={handleOnFocus} onBlur={handleOnBlur} width={width}>
      <AutoColumn gap="6px">
        <Text fontSize="12px" textAlign="center">
          {title}
        </Text>

        <InputRow>
          {!locked && (
            <IconButtonBG scale="xs" onClick={handleDecrement} disabled={decrementDisabled}>
              <MinusIcon size={18} />
            </IconButtonBG>
          )}

          <StyledInput
            className="rate-input-0"
            value={localValue}
            disabled={locked}
            onUserInput={(val) => {
              setLocalValue(val);
            }}
          />

          {!locked && (
            <IconButtonBG width={32} height={32} onClick={handleIncrement} disabled={incrementDisabled}>
              <PlusIcon size="18px" />
            </IconButtonBG>
          )}
        </InputRow>

        <Text fontSize="12px" textAlign="center">
          {tokenB} per {tokenA}
        </Text>
      </AutoColumn>
    </FocusedOutlineCard>
  );
};

export default StepCounter;
