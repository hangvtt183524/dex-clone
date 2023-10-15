import { Box } from 'components/Box';
import ButtonBorderGradient from 'components/Button/ButtonBorderGradient';
import DropdownMenu from 'components/DropdownMenu';
import Image from 'components/Image';
import Text from 'components/Text';
import useTooltip from 'hooks/useTooltip';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import RoboTheme from 'styles';
import { DownIcon } from 'svgs';
import { Column } from '../Column';
import { RowMiddle } from '../Row';

const StyledIcon = styled(Box)`
  border-radius: ${({ theme }) => theme.radius.tiny};
`;

const ItemEcosystem = ({ image, title, description, href }) => (
  <RowMiddle p="16px" as="a" href={href} target="_blank">
    <StyledIcon mr="12px">
      <Image src={image} width={32} height={32} alt="robo-dao" />
    </StyledIcon>
    <Column>
      <Text fontWeight={600}>{title}</Text>
      <Text color="textSubtle" fontSize="12px">
        {description}
      </Text>
    </Column>
  </RowMiddle>
);
const ButtonEcosystem = () => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip('Our Ecosytems', { trigger: 'hover', placement: 'right' });
  const renderContent = useMemo(
    () => (
      <Box p="8px" zIndex={100000} background={`${RoboTheme.colors.modal} !important`}>
        <ItemEcosystem
          image="/assets/images/system/robo-ex.png"
          title="RoboEx"
          description="All-round decentralized transaction services"
          href="/"
        />
        <ItemEcosystem
          image="/assets/images/system/robo-dao.png"
          title="RoboDAO"
          description="For holders who stakes RBIF tokens to vote..."
          href="https://dashboard.roboglobal.info/vote"
        />
        <ItemEcosystem
          image="/assets/images/system/robo-wallet.png"
          title="RoboWallet"
          description="A personal wallet to store, track and ..."
          href="https://chrome.google.com/webstore/detail/robo-wallet-testnet/namdenejojopbnekajecohieicljpcgb"
        />
        <ItemEcosystem
          image="/assets/images/system/robo-dashboard.png"
          title="RoboDashboard"
          description="Track your reflections and airdrop events..."
          href="https://dashboard.roboglobal.info/"
        />
      </Box>
    ),
    [],
  );
  return (
    <Box ref={targetRef}>
      <DropdownMenu trigger="click" maxWidthContent={360} content={renderContent}>
        <ButtonBorderGradient background="topbar">
          <Image src="/assets/images/system/ecosystem.png" width={24} height={24} alt="icon-ecosystem" />
          <DownIcon ml="8px" />
        </ButtonBorderGradient>
      </DropdownMenu>
      {tooltipVisible && tooltip}
    </Box>
  );
};

export default ButtonEcosystem;
