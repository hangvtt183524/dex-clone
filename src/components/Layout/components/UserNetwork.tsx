import { Box } from 'components/Box';
import ButtonBorderGradient from 'components/Button/ButtonBorderGradient';
import IconButton from 'components/Button/IconButton';
import { Card } from 'components/Card';
import DropdownMenu from 'components/DropdownMenu';
import CircleLoader from 'components/Loader/CircleLoader';
import { ChainLogo } from 'components/Logo/ChainLogo';
import Text from 'components/Text';
import { chainActive } from 'config/constants/chains';
import { CHAIN_ID_DEFAULT } from 'config/env';
import { networks } from 'config/networks';
import { SupportedChainId } from 'config/sdk-core';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import {useAccount, useChainId} from 'packages/wagmi/src';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import RoboTheme from 'styles';
import { CheckMarkGradientIcon, DownIcon } from 'svgs';
import { useSwitchNetwork } from 'wagmi';
import { useAppDispatch } from 'state/store';
import { setSelectedChainNetwork } from 'state/user/actions';
import { useSelectedChainNetwork } from 'state/user/hooks';
import useWarningNetworkModal from 'components/WarningNetworkModal/hooks';

const UserNetwork: React.FC<{ width?: string, showNetworkInMobile?: boolean }> = ({ width, showNetworkInMobile = false }) => {
  const { chainId, isWrongNetwork } = useActiveWeb3React();
  const selectedChainNetwork = useSelectedChainNetwork();
  const chainWallet = useChainId();
  const { isMobile } = useMatchBreakpoints();
  const [selectNetwork, setSelectNetwork] = useState(selectedChainNetwork);
  const networkInfo = networks?.[selectedChainNetwork] || networks[CHAIN_ID_DEFAULT];
  const { switchNetwork, isLoading } = useSwitchNetwork();
  const { isConnected } = useAccount();
  const dispatch = useAppDispatch();
  const { onPresentWarningNetworkModal, onDismissWarningNetworkModal } = useWarningNetworkModal();

  const handleSelectSortOption = useCallback(
    (chain: SupportedChainId) => {
      setSelectNetwork(chain);
      if (switchNetwork && chainWallet !== chain) switchNetwork(chain);
      dispatch(setSelectedChainNetwork(chain));
    },
    [switchNetwork, chainWallet],
  );

  useEffect(() => {
    if (isWrongNetwork || !chainActive.includes(chainId)) {
        onPresentWarningNetworkModal();
    } else {
        onDismissWarningNetworkModal();
    }

    if (isConnected) {
          dispatch(setSelectedChainNetwork(chainId));
    }

    if (!isLoading && selectNetwork === chainId && !selectNetwork) {
      setSelectNetwork(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, chainId, isWrongNetwork, isConnected]);

  const renderContent = useMemo(() => {
    return (
      <Card background={`${RoboTheme.colors.modal} !important`} p="16px 8px !important">
        <Text px="16px" mb="8px">
          Select Network
        </Text>
        {chainActive.map((chain) => {
          const network = networks?.[chain]?.networkInfo;
          if (!network) return;

          return (
            <StyledItemNetwork key={`chain-id-${chain}`} onClick={() => handleSelectSortOption(chain)}>
              <ChainLogo chainId={chain} />
              <Text mx="8px" mr="auto">
                {isMobile ? network?.shortName : network?.displayName}
              </Text>
              {chain === selectNetwork && isLoading && <CircleLoader size={16} />}
              {!isWrongNetwork && chain === selectedChainNetwork && <CheckMarkGradientIcon />}
            </StyledItemNetwork>
          );
        })}
      </Card>
    );
  }, [selectedChainNetwork, handleSelectSortOption, isLoading, isMobile, selectNetwork]);

  return (
    <Box>
      <DropdownMenu placement="bottom-start" trigger="click" maxWidthContent={250} content={renderContent}>
          {!isWrongNetwork && chainActive.includes(chainId) ? (
              <StyledWrapper width={width || 'max-content'}>
                  <ChainLogo chainId={networkInfo?.chainId} />
                  <Text mx="8px" fontSize="14px">
                      {networkInfo?.networkInfo?.displayName ?? 'Network'}
                  </Text>
                  {!isMobile && <DownIcon ml="auto" />}
              </StyledWrapper>
          ) : showNetworkInMobile ? (
              <StyledWrongNetworkWrapper width={width || 'max-content'}>
                  <Text mx="8px" fontSize="14px">
                      Wrong network
                  </Text>
                  {!isMobile && <DownIcon ml="auto" />}
              </StyledWrongNetworkWrapper>
          ) : (
              <StyledWrapper width={width || 'max-content'}>
                  <Text mx="8px" fontSize="14px">
                      Wrong network
                  </Text>
                  {!isMobile && <DownIcon ml="auto" />}
              </StyledWrapper>
          )}
      </DropdownMenu>
    </Box>
  );
};

const StyledWrapper = styled(ButtonBorderGradient).attrs({
  variant: 'disabled',
  background: 'topbar',
})`
  padding: 0;
  min-width: 40px;
  display: flex;

  ${Text} {
    display: none;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    ${Text} {
      display: flex;
      white-space: nowrap;
    }
  }
`;

const StyledWrongNetworkWrapper = styled(ButtonBorderGradient).attrs({
    variant: 'disabled',
    background: 'topbar',
})`
  padding: 0;
  min-width: 40px;
  display: flex;

  ${({ theme }) => theme.mediaQueries.sm} {
    ${Text} {
      display: flex;
      white-space: nowrap;
    }
  }
`;

const StyledItemNetwork = styled(IconButton)`
  text-align: left;
  justify-content: start;
  width: 100%;

  padding: 8px 16px;
  margin: 4px 0;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt} !important;
  }
`;
export default UserNetwork;
