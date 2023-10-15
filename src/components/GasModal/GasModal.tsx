import {AutoRow, RowBetween, RowFixed} from 'components/Layout/Row';
import Text from 'components/Text';
import styled from 'styled-components';
import Modal, { InjectedModalProps } from 'components/Modal';
import React, {useEffect, useMemo, useState} from 'react';
import useCountDown from 'hooks/useCountdown';
import { GasPriceTypes } from 'state/user/actions';
import { GAS_PRICE_INTERVAL, GAS_GWEI_DECIMALS } from 'config/constants';
import GasChart from '../Gas/GasChart';
import IconButton from '../Button/IconButton';
import { RefreshIcon } from '../../svgs';
import { dataInforGasFee } from '../Gas/types';
import { Column } from '../Layout/Column';
import useActiveWeb3React from '../../hooks/web3React/useActiveWeb3React';
import { displayBalanceEthValue } from '../../utils/numbersHelper';
import { getEthPrice } from '../../subgraph/contexts/Application';

const GasInfoData = ({
    icon: Icon,
    title,
    time,
    type,
    price,
    priceUsd
}: {
    icon: any;
    title: string;
    time: string;
    type: GasPriceTypes;
    price: number;
    priceUsd: number
}) => {
    return (
        <StyledWrapRowBox>
            <RowFixed height="100%">
                <Icon size="28px" />
                <Column ml="8px" height="100%">
                    <Text>{title}</Text>
                    <Text textAlign="left" fontSize="12px" lineHeight="12px" color="textSubtle">
                        Estimate: {time}
                    </Text>
                </Column>
            </RowFixed>

            <Column ml="8px" height="100%" justifyContent="flex-end" alignItems="flex-end">
                <Text textAlign="right">{displayBalanceEthValue(price)} GWEI</Text>

                <Text textAlign="right" fontSize="12px" lineHeight="12px" color="textSubtle">
                    ${priceUsd?.toFixed(8) || 0}
                </Text>
            </Column>
        </StyledWrapRowBox>
    )
}

const GasModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const [timeLeft, actions] = useCountDown(GAS_PRICE_INTERVAL);
  const formatTimeLeft = timeLeft / 1000;

  const { provider } = useActiveWeb3React();
  const [gasPrice, setGasPrice] = useState<number>(0);
  const [gweiPrice, setGweiPrice] = useState<number>(0);

  useEffect(() => {
      if (timeLeft === 0) {
          getEthPrice().then(([newPrice]) => {
              setGweiPrice(newPrice / 10 ** GAS_GWEI_DECIMALS);
          });

          provider.getGasPrice().then((price) => {
              setGasPrice(price.toNumber() / 10 ** GAS_GWEI_DECIMALS);
          });

          setTimeout(() => {
             actions.start(GAS_PRICE_INTERVAL);
          }, 2000);
      }
  }, [actions, timeLeft, provider]);

  const handleReloadGasPrice = () => {
      actions.reset();
  };

  return (
      <Modal title="Gas Fee" onDismiss={onDismiss}>
          <AutoRow gap="28px" width="auto">
              <Column justifyContent="center">
                  <GasChart price={gasPrice} mx="auto" />
                  <Text textAlign="center">This gas tracker will show the gas </Text>
                  <Text textAlign="center">price that people chose mostly.</Text>
              </Column>

              <Column width="350px">
                  <RowBetween>
                      <Text color="textSubtle" display="flex">
                          Next update
                          <Text ml="4px">{formatTimeLeft}</Text>
                      </Text>

                      <IconButton onClick={handleReloadGasPrice}>
                          <RefreshIcon />
                      </IconButton>
                  </RowBetween>

                  {dataInforGasFee.map((gasfee) => (
                      <GasInfoData
                          key={gasfee.type}
                          icon={gasfee.icon}
                          title={gasfee.title}
                          time={gasfee.time}
                          type={gasfee.type}
                          price={gasPrice * gasfee.multi}
                          priceUsd={gasPrice * gasfee.multi * gweiPrice}
                      />
                  ))}
              </Column>
          </AutoRow>
      </Modal>
  );
};

const StyledWrapRowBox = styled(IconButton)`
  width: 100%;
  height: max-content;
  margin-top: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: linear-gradient(180deg, rgba(52, 58, 66, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%);
  box-shadow: inset 4px 4px 16px rgba(84, 84, 84, 0.21);
  padding: 12px 20px;
  border-radius: ${({ theme }) => theme.radius.small};
`;

export default GasModal;
