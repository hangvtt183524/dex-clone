import { Box } from 'components/Box';
import { ButtonMenu, ButtonMenuItem } from 'components/ButtonMenu';
import { Card } from 'components/Card';
import { Column, ColumnCenter } from 'components/Layout/Column';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import DefaultPool from './DefaultPool';
import MyPools from './MyPools';
import PoolHeader from './PoolHeader';
import PoolFilter from './components/PoolFilter';

enum MenuTabEnum {
  Pools = 0,
  MyPools = 1,
}

const menuTab = [
  {
    key: MenuTabEnum.Pools,
    title: 'Pools',
  },
  {
    key: MenuTabEnum.MyPools,
    title: 'My Pools',
  },
];

const Pools: React.FC = () => {
  const [menu, setMenu] = useState(1);
  const { t } = useTranslation();

  const renderContentMenuTab = useMemo(() => {
    switch (menu) {
      case MenuTabEnum.Pools:
        return <DefaultPool />;
      case MenuTabEnum.MyPools:
        return <MyPools />;
      default:
        return <MyPools />;
    }
  }, [menu]);

  return (
    <Wrapper>
      <PoolHeader />

      {/* <ColumnCenter mb="16px">
        <ButtonMenu activeIndex={menu} onItemClick={(idx) => setMenu(idx)} scale="sm" width="240px !important">
          {menuTab.map((itemMenu) => {
            return (
              <ButtonMenuItem
                key={itemMenu.key}
                style={{
                  whiteSpace: 'nowrap',
                }}
                height={['32px', '40px']}
                width="50%"
              >
                {t(itemMenu.title)}
              </ButtonMenuItem>
            );
          })}
        </ButtonMenu>
        <PoolFilter mt="16px" isMobile />
      </ColumnCenter> */}

      <StyledWrapTable>
        <Card background="#131415" boxShadow="form" width="100%" radius="medium" scale="md">
          {renderContentMenuTab}
        </Card>
      </StyledWrapTable>
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  align-items: flex-start;
  gap: 4px;
  max-width: ${({ theme }) => theme.siteWidth}px;
  margin: 0 auto;
  width: 100%;
`;

const StyledWrapTable = styled(Box)`
  padding: 1.25px 0.8px;
  background: ${({ theme }) => theme.colors.cardGradient};
  border-radius: ${({ theme }) => theme.radius.medium};
  width: 100%;
`;

export default Pools;
