import { Box } from 'components/Box';
import Button from 'components/Button';
import ButtonBorderGradient from 'components/Button/ButtonBorderGradient';
import Image from 'components/Image';
import { ColumnCenter } from 'components/Layout/Column';
import { AutoRow } from 'components/Layout/Row';
import { NextLinkFromReactRouter } from 'components/Link/NextLink';
import Text from 'components/Text';
import { urlRoute } from 'config/endpoints';
import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Heading from 'components/Heading';
import { useAccount } from '../../packages/wagmi/src';

const PoolHeader = () => {
  const router = useRouter();
  const { isConnected } = useAccount();

  return (
    <StyledWrapper>
      <StyledWrapInfo>
        <Heading fontSize="24px !important" mb="16px">
          Pools
        </Heading>
        <StyledTitle
          as="h2"
          fontSize={['16px', '', '24px', '', '28px']}
          lineHeight={['24px', '', '30px', '', '36px']}
          textTransform="uppercase"
        >
          Create your own pools - add liquidity
        </StyledTitle>

          {isConnected ?
              <StyledWrapButton gap="8px">
                  <Button
                      mr="16px"
                      width={['110px', '', '120px', '', '180px']}
                      height={['36px', '', '42px']}
                      as={NextLinkFromReactRouter}
                      to={urlRoute.addLiquidity({}).to}
                  >
                      <Text fontSize={['12px', '', '14px', '', '16px']}>Create Pool</Text>
                  </Button>

                  <Box width={['110px', '', '120px', '', '180px']} height={['36px', '', '41px']}>
                      <ButtonBorderGradient
                          height="100% !important"
                          width="100%"
                          onClick={() => {
                              router.push(urlRoute.findPool().to);
                          }}
                          scale="md"
                      >
                          <Text fontSize={['12px', '', '14px', '', '16px']}> Find Pool</Text>
                      </ButtonBorderGradient>
                  </Box>
              </StyledWrapButton>

              : <Text>Connect wallet to create or find pool</Text>
          }


      </StyledWrapInfo>
      <StyledWrapImage>
        <Image src="/assets/images/header-pool.png" width={443} height={275} alt="header-pool" />
      </StyledWrapImage>
    </StyledWrapper>
  );
};

const StyledWrapButton = styled(AutoRow)`
  flex-wrap: wrap;
  justify-content: center;
  align-items: Center;
  width: 100%;
`;

const StyledWrapImage = styled(Box)`
  ${({ theme }) => theme.mediaQueries.xxl} {
    transform: scale(1.2);
  }
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
    ${StyledWrapButton} {
      justify-content: flex-start;
    }
  }
`;

const StyledWrapInfo = styled(ColumnCenter)`
  flex: 1 1;
  width: max-content;
  margin-bottom: 32px;
  align-items: center;
  justify-content: center;
  width: 100%;

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

export default PoolHeader;
