import { Box } from 'components/Box';
import { ButtonMenu, ButtonMenuItem } from 'components/ButtonMenu';
import { ColumnCenter } from 'components/Layout/Column';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import PoolFilter from 'views/Pools/components/PoolFilter';
import { useTrendingInitial } from './TrendingConfig';
import TrendingList from './components/TrendingList';
import { trendingTypeTabs } from './types';

const Trending: React.FC = () => {
  const [menu, setMenu] = useState(0);
  const { t } = useTranslation();

  useTrendingInitial();

  return (
    <Wrapper>
      <ColumnCenter mb="32px">
        <ButtonMenu
          activeIndex={menu}
          onItemClick={(idx) => setMenu(idx)}
          scale="sm"
          width={['300px !important', '', '370px !important']}
        >
          {trendingTypeTabs.map((itemMenu) => {
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
      </ColumnCenter>

      <TrendingList status={trendingTypeTabs[menu].key} />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  width: 100%;
  height: 100%;
  margin-bottom: 20vh;
`;

export default Trending;
