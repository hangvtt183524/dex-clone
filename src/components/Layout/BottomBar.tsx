import { Box, Grid } from 'components/Box';
import Text from 'components/Text';
import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'components/Link';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import RoboTheme from 'styles';
import { AutoColumn } from './Column';
import { menuConfigs } from './components/common';

const ItemMenuBottomBar = ({ Icon, IconActive, title, href, active, ...props }) => {
  return (
    <Link href={href} mx="auto" {...props}>
      <AutoColumn gap="4px">
        <Box mx="auto" minWidth="24px" minHeight="24px">
          {active ? <IconActive /> : <Icon />}
        </Box>
        <Text fontWeight={500} gradient={active && RoboTheme.colors.gradients.primary} color="textAlt3" fontSize="10px">
          {title}
        </Text>
      </AutoColumn>
    </Link>
  );
};

const BottomBar = () => {
  const router = useRouter();
  const { isTablet, isMobile } = useMatchBreakpoints();
  const bottomBarMenuConfigs = menuConfigs.slice(0, menuConfigs.length);

  return (
    (isMobile || isTablet) && (
      <Wrapper>
        <Container gridTemplateColumns={`repeat(${bottomBarMenuConfigs.length}, 1fr)`}>
          {bottomBarMenuConfigs.map((menu) => {
            const { Icon, IconActive, title } = menu;
            const to = menu?.route?.to || '';
            const path = menu?.route?.path || '';
            const isMatch = path === router.route;
            return (
              <ItemMenuBottomBar
                key={`bottom-bar-${title}`}
                Icon={Icon}
                IconActive={IconActive}
                title={title}
                href={to}
                active={isMatch}
              />
            );
          })}
        </Container>
      </Wrapper>
    )
  );
};

const Wrapper = styled(Box)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  z-index: ${({ theme }) => theme.zIndices.dropdown};
`;

const Container = styled(Grid)`
  height: ${({ theme }) => theme.bottombarHeight}px;
  background: ${({ theme }) => theme.colors.background};
  backdrop-filter: blur(2px);

  justify-content: center;
`;

export default BottomBar;
