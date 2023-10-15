import { Box } from 'components/Box';
import IconButton from 'components/Button/IconButton';
import Heading from 'components/Heading';
import { RowCenter } from 'components/Layout/Row';
import Router from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { ArrowLeftBackIcon } from 'svgs';

const StyledHeaderAddLiquidity = styled(RowCenter)`
  position: relative;

  width: 100%;

  margin-bottom: 20px;
`;

const PoolFinderHeader = () => {
  return (
    <StyledHeaderAddLiquidity>
      <Box position="absolute" left="0">
        <IconButton onClick={() => Router.back()}>
          <ArrowLeftBackIcon />
        </IconButton>
      </Box>
      <Heading>Import V2 Pool</Heading>
    </StyledHeaderAddLiquidity>
  );
};

export default React.memo(PoolFinderHeader);
