import AccountButton from 'components/AccountButton';
import IconButtonBG from 'components/Button/IconButtonBG';
import ButtonBorderGradient from 'components/Button/ButtonBorderGradient';
import { GasIcon } from 'svgs';
import Page from 'components/Page';
import React from 'react';
import styled from 'styled-components';
import { breakpointMap } from 'styles/base';
import { useGasModal } from 'components/GasModal/hooks';
import ButtonEcosystem from './components/ButtonEcosystem';
import UserNetwork from './components/UserNetwork';
import { RowFixed, RowMiddle } from './Row';
import { useAccount } from '../../packages/wagmi/src';

const Wrapper = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  width: 100%;
  height: ${({ theme }) => theme.topbarHeight}px;

  display: flex;
  align-items: center;

  background: ${({ theme }) => theme.colors.topbar};
  backdrop-filter: blur(2px);

  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown * 100};
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(2px);

  @media (max-width: ${breakpointMap.sm}px) {
    ${IconButtonBG} {
      background: transparent;
      box-shadow: none;
    }
  }
`;

const Topbar = () => {
  const { onPresentGasModal } = useGasModal();
    const { isConnected } = useAccount();
    
  return (
    <Wrapper>
      <Page py="0 !important" flexDirection="row" alignItems="center">
        <ButtonEcosystem />
        <RowMiddle justifyContent="flex-end !important">
          <RowFixed gap="6px">
            {isConnected &&
                <ButtonBorderGradient background="topbar" p="8.2px" onClick={onPresentGasModal}>
                  <GasIcon />
                </ButtonBorderGradient>
            }

            <UserNetwork />
            <AccountButton />
          </RowFixed>
        </RowMiddle>
      </Page>
    </Wrapper>
  );
};

export default Topbar;
