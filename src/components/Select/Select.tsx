import { Box } from 'components/Box';
import Text from 'components/Text';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { variant } from 'styled-system';
import RoboTheme from 'styles';
import { DownIcon } from 'svgs';
import { SelectProps, SelectStyledProps, variants } from './types';

const styledHeaderVariant = {
  [variants.PRIMARY]: {
    background: RoboTheme.colors.inputQuaternary,
  },
  [variants.SECONDARY]: {
    background: RoboTheme.colors.select,
  },
};

const styledContainerListVariant = {
  [variants.PRIMARY]: {
    background: RoboTheme.colors.inputQuaternary,
  },
  [variants.SECONDARY]: {
    background: RoboTheme.colors.select,
  },
};

const DropDownHeader = styled(Box)<SelectStyledProps>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  border-radius: ${({ theme }) => theme.radius.small};
  transition: border-radius 0.15s;
  background: ${({ theme }) => theme.colors.inputTertiary};

  ${variant({
    prop: 'variant',
    variants: styledHeaderVariant,
  })}
`;

const DropDownListContainer = styled(Box)<SelectStyledProps>`
  min-width: 136px;
  position: absolute;
  overflow: hidden;

  transition: ${({ theme }) => theme.transitions.fast};
  transform: translateY(10px);
  transform-origin: bottom;
  opacity: 0;
  width: 100%;
  z-index: -1;
  visibility: hidden;
  border-radius: ${({ theme }) => theme.radius.small};
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  ${variant({
    prop: 'variant',
    variants: styledContainerListVariant,
  })}
`;

const DropDownContainer = styled(Box)<{ isOpen: boolean } & SelectStyledProps>`
  cursor: pointer;
  width: 100%;
  position: relative;
  border-radius: ${({ theme }) => theme.radius.small};
  height: 40px;
  min-width: 136px;
  user-select: none;
  z-index: 20;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  ${({ isOpen, theme }) =>
    isOpen &&
    css`
      ${DropDownListContainer} {
        z-index: ${theme.zIndices.dropdown};
        visibility: visible;

        transform: translateY(4px);
        opacity: 1;
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`;

const ListItem = styled.li`
  list-style: none;
  padding: 10px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt};
  }
`;

const Select: React.FunctionComponent<React.PropsWithChildren<SelectProps>> = ({
  options,
  onOptionChange,
  defaultOptionIndex = 0,
  placeHolderText,

  height,
  background,
  minWidth,
  variant = variants.PRIMARY,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionSelected, setOptionSelected] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(defaultOptionIndex);

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen);
    event.stopPropagation();
  };

  const onOptionClicked = useCallback(
    (selectedIndex: number) => {
      setSelectedOptionIndex(selectedIndex);
      setIsOpen(false);
      setOptionSelected(true);
      if (onOptionChange) {
        onOptionChange(options[selectedIndex]);
      }
    },
    [onOptionChange, options],
  );

  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (defaultOptionIndex !== selectedOptionIndex) {
      setSelectedOptionIndex(defaultOptionIndex);
      setOptionSelected(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOptionIndex]);

  const renderOptions = useMemo(
    () =>
      options.map((option, index) =>
        placeHolderText || index !== selectedOptionIndex ? (
          <ListItem onClick={() => onOptionClicked(index)} key={option.label}>
            <Text color="textSecondary" fontSize="16px">
              {option.label}
            </Text>
          </ListItem>
        ) : null,
      ),
    [onOptionClicked, options, placeHolderText, selectedOptionIndex],
  );

  return (
    <DropDownContainer isOpen={isOpen} height={height} minWidth={minWidth} {...props}>
      <DropDownHeader onClick={toggling} height={height} background={background} variant={variant}>
        <Text fontSize="16px" color={!optionSelected && placeHolderText ? 'textSubtle' : 'text'}>
          {!optionSelected && placeHolderText ? placeHolderText : options[selectedOptionIndex]?.label}
        </Text>
        <DownIcon onClick={toggling} />
      </DropDownHeader>
      <DropDownListContainer minWidth={minWidth} variant={variant}>
        <DropDownList>{renderOptions}</DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  );
};

export default Select;
