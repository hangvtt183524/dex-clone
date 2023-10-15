import { Box } from 'components/Box';
import IconButton from 'components/Button/IconButton';
import React from 'react';
import styled from 'styled-components';
import { ArrowRightIcon } from 'svgs';

interface DetailsProps {
  actionPanelToggled: boolean;
}

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-right: 8px;
  color: ${({ theme }) => theme.colors.primary};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 0px;
  }
`;

const ArrowIcon = styled(Box)<{ rotateArrow: boolean }>`
  transition: ${({ theme }) => theme.transitions.fast};
  transform: ${({ rotateArrow }) => (rotateArrow ? 'rotate(90deg)' : 'rotate(0)')};
  height: 20px;
`;

const Details: React.FC<React.PropsWithChildren<DetailsProps>> = ({ actionPanelToggled }) => {
  return (
    <Container>
      <IconButton>
        <ArrowIcon rotateArrow={Boolean(actionPanelToggled)}>
          <ArrowRightIcon />
        </ArrowIcon>
      </IconButton>
    </Container>
  );
};

export default Details;
