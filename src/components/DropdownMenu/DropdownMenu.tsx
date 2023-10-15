import useOnClickOutside from 'hooks/useOnClickOutside';
import React, { useEffect, useState, useCallback } from 'react';
import { usePopper } from 'react-popper';
import { Box } from '../Box';
import { StyledDropdownMenu } from './styles';
import { DropdownMenuProps } from './types';

const DropdownMenu: React.FC<React.PropsWithChildren<DropdownMenuProps>> = ({
  children,
  isBottomNav = false,
  showItemsOnMobile = false,
  content,
  trigger = 'hover',
  placement = 'bottom-start',
  index,
  setMenuOpenByIndex,
  // isDisabled,
  maxWidthContent,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null);
  const isModeHover = trigger === 'hover';

  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    placement: isBottomNav ? 'top' : placement,
    modifiers: [
      {
        name: 'offset',
        options: { offset: [0, isBottomNav || trigger ? 5 : 5] },
      },
    ],
  });

  const isMenuShow = isOpen && ((isBottomNav && showItemsOnMobile) || !isBottomNav);

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true);
    };

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node;
      return target && !tooltipRef?.contains(target) && setIsOpen(false);
    };
    if (isModeHover) {
      targetRef?.addEventListener('mouseenter', showDropdownMenu);
      targetRef?.addEventListener('mouseleave', hideDropdownMenu);
    }

    return () => {
      if (isModeHover) {
        targetRef?.removeEventListener('mouseenter', showDropdownMenu);
        targetRef?.removeEventListener('mouseleave', hideDropdownMenu);
      }
    };
  }, [targetRef, tooltipRef, setIsOpen, isBottomNav, isModeHover]);

  useEffect(() => {
    if (setMenuOpenByIndex && index !== undefined) {
      setMenuOpenByIndex((prevValue) => ({
        ...prevValue,
        [index]: isMenuShow,
      }));
    }
  }, [isMenuShow, setMenuOpenByIndex, index]);

  useOnClickOutside(
    targetRef,
    useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen]),
  );

  return (
    <Box ref={setTargetRef} {...props}>
      <Box
        pb="7px"
        mb="-7px"
        onPointerDown={() => {
          setIsOpen((s) => !s);
        }}
      >
        {children}
      </Box>

      <StyledDropdownMenu
        style={styles.popper}
        ref={setTooltipRef}
        {...attributes.popper}
        $isBottomNav={isBottomNav}
        $isOpen={isMenuShow}
        width={maxWidthContent && '100% !important'}
        maxWidth={maxWidthContent && `${maxWidthContent}px !important`}
      >
        {content || <></>}
      </StyledDropdownMenu>
    </Box>
  );
};

export default DropdownMenu;
