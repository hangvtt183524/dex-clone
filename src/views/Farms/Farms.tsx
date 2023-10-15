import { Box } from 'components/Box';
import { ColumnCenter } from 'components/Layout/Column';
import React from 'react';
import styled from 'styled-components';
import FarmConfig from './FarmConfigs';
import FarmFilter from './components/FarmFilter';
import FarmHeader from './components/FarmHeader';
import FarmList from './components/FarmList';

const Farms: React.FC = () => {
  return (
    <Wrapper>
      <FarmConfig />
      <FarmHeader />

      <ColumnCenter my="16px">
        <FarmFilter isMobile />
      </ColumnCenter>

      <FarmList />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  width: 100%;
  height: 100%;
  margin-bottom: 20vh;
`;

export default Farms;
