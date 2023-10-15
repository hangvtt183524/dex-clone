import { Box } from 'components/Box';
import Heading from 'components/Heading';
import Image from 'components/Image';
import { ColumnCenter } from 'components/Layout/Column';
import { RowCenter, RowMiddle } from 'components/Layout/Row';
import Text from 'components/Text';
import React from 'react';
import styled from 'styled-components';

const FarmHeader = () => {
  return (
    <StyledWrapper>
      <StyledWrapInfo>
        <Heading fontSize="24px !important" mb="16px">
          Farm
        </Heading>
        <StyledTitle
          as="h2"
          fontSize={['16px', '', '24px', '', '28px']}
          lineHeight={['24px', '', '30px', '', '36px']}
          textTransform="uppercase"
        >
          Stake your liquidity provider (LP) tokens to earn rewards.
        </StyledTitle>

        <StyledWrapStep>
          <RowMiddle className="step">
            <Dot>1</Dot>
            <TitleStep>Add liquidity</TitleStep>
            <TitleStep mt="2px" lineHeight="10px">
              &gt;&gt;
            </TitleStep>
          </RowMiddle>
          <RowMiddle className="step">
            <Dot>2</Dot>
            <TitleStep>Receive LP tokens</TitleStep>
            <TitleStep mt="2px" lineHeight="10px">
              &gt;&gt;
            </TitleStep>
          </RowMiddle>
          <RowMiddle className="step">
            <Dot>3</Dot>
            <TitleStep>Stake</TitleStep>
          </RowMiddle>
        </StyledWrapStep>
      </StyledWrapInfo>
      <StyledWrapImage>
        <Image src="/assets/images/header-farm.png" width={350} height={217} alt="header-farm" />
      </StyledWrapImage>
    </StyledWrapper>
  );
};

const StyledWrapImage = styled(Box)`
  min-height: 250px;
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

const StyledWrapStep = styled(RowMiddle)`
  flex-direction: column;
  width: max-content;

  .step {
    margin: 6px 0;
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    flex-direction: row;
    .step {
      margin: 0;
    }
  }
`;

const Dot = styled(RowCenter)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #0096f2;
  color: #2d3748;
  margin-right: 8px;
  font-size: 12px;
  line-height: 16px;
`;

const TitleStep = styled(Text).attrs({
  mr: '8px',
  fontSize: ['10px', '', '12px', '', '14px'],
  lineHeight: '14px',
  fontWeight: 500,
  color: 'text',
})``;

export default FarmHeader;
