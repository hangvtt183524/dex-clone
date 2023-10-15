import { Box } from 'components/Box';
import { ColumnCenter } from 'components/Layout/Column';
import React from 'react';
import styled from 'styled-components';
import FarmFilter from 'views/Farms/components/FarmFilter';
import EarnConfig from './EarnConfig';
import EarnHeader from './components/EarnHeader';
import EarnList from './components/EarnList';

const Earn: React.FC = () => {
  return (
    <Wrapper>
      <EarnConfig />
      <EarnHeader />

      <ColumnCenter my="16px">
        <FarmFilter isMobile />
      </ColumnCenter>

      <EarnList />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  width: 100%;
  height: 100%;
  margin-bottom: 20vh;
`;

export default Earn;
