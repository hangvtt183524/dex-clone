import { Box } from 'components/Box';
import Heading from 'components/Heading';
import Image from 'components/Image';
import { ColumnCenter } from 'components/Layout/Column';
import Text from 'components/Text';
import React from 'react';
import styled from 'styled-components';

const EarnHeader = () => {
  return (
    <StyledWrapper>
      <StyledWrapInfo>
        <Heading fontSize="24px !important" mb="16px">
          Earn
        </Heading>
        <StyledTitle
          as="h2"
          fontSize={['16px', '', '24px', '', '28px']}
          lineHeight={['24px', '', '30px', '', '36px']}
          textTransform="uppercase"
        >
          Stake tokens to earn these tokens and some hidden gems
        </StyledTitle>
      </StyledWrapInfo>
      <StyledWrapImage>
        <Image src="/assets/images/header-earn.png" width={350} height={217} alt="header-earn" />
      </StyledWrapImage>
    </StyledWrapper>
  );
};

const StyledWrapImage = styled(Box)`
  position: relative;
`;

const StyledWrapper = styled(ColumnCenter)`
  text-align: center;
  justify-content: center;
  align-items: center;
  margin: 16px 0 32px;
  ${Heading} {
    display: block;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    flex-direction: row;
    align-items: start;
    justify-content: space-between;
    ${Heading} {
      display: none;
    }
  }
`;

const StyledWrapInfo = styled(ColumnCenter)`
  flex: 1 1;
  width: 100%;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.lg} {
    justify-content: flex-start;
    align-items: start;
    margin-bottom: 0;
  }
`;
const StyledTitle = styled(Text)`
  margin-bottom: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: 32px;
  }
`;

export default EarnHeader;
