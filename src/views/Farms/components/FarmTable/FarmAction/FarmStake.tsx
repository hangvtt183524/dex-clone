import { Flex } from 'components/Box';
import ActionButton from 'components/Button/ActionButton';
import NumericalInputMax from 'components/Input/NumericalInputMax';
import { Column } from 'components/Layout/Column';
import { RowBetween } from 'components/Layout/Row';
import Text from 'components/Text';
import React, { useMemo, useState } from 'react';

import styled from 'styled-components';
import { getFullDecimals, parseNumberDisplay } from 'utils/numbersHelper';
import { Dots } from 'styles/common';
import { Trans } from 'react-i18next';
import Link from 'components/Link';
import { urlRoute } from 'config/endpoints';
import { unwrappedToken } from 'utils/wrappedCurrency';
import { getAddressCurrency } from 'utils/addressHelpers';
import BigNumber from 'bignumber.js';
import useStakeFarms from '../../hooks/useStakeFarms';
import { useApproveStaking } from '../../hooks/useAppoveStaking';
import { RowPropsWithLoading } from '../../types';

const Wrapper = styled(Column)``;

const FarmStake: React.FC<any> = ({ details }) => {
  const lpBalance = useMemo(() => parseNumberDisplay(details?.userData?.tokenBalance, 10, details.lpTokenDecimals), [details]);
  const [userInput, setUserInput] = useState('');
  const { onStake, submitting } = useStakeFarms(details.manager, details.poolId);

  /* Approval */
  const { isApprovePending, showApproveFlow, approveTokenButtonDisabled, handleApprove } = useApproveStaking(
    details.manager,
    details.poolId,
    details.userData.tokenBalance.toString(),
  );

  /* Approval */
  const currency0 = unwrappedToken(details?.token);
  const currency1 = unwrappedToken(details?.quoteToken);

  const handleStake = () => {
    return onStake(getFullDecimals(userInput, 18).toString()).then(() => {
      setUserInput('');
    });
  };

  const urlLink = useMemo(
    () =>
      urlRoute.addLiquidity({
        inputCurrency: getAddressCurrency(currency0),
        outputCurrency: getAddressCurrency(currency1),
      }).to,
    [currency0, currency1],
  );

  const isEnoughtBalanceToApprove = details?.userData?.tokenBalance?.gt(0);
  const isValidateInput = new BigNumber(userInput.replaceAll(',', '')).gt(0) && new BigNumber(userInput.replaceAll(',', '')).lte(lpBalance.replaceAll(',', ''));

  return (
    <Wrapper>
      <RowBetween alignItems="flex-start !important" flex={1}>
        <Column>
          <Text color="textSubtle" fontSize="12px" mb="12px">
            Your LP Tokens:
          </Text>
          <Text fontWeight={600}>{lpBalance}</Text>
        </Column>
        <Link textAlign="right" external href={urlLink} fontSize="12px" color="loading">
          Get LP Tokens
        </Link>
      </RowBetween>
      <Flex my={['8px', '8px', '18px']} maxHeight={52} className="select-input-token">
        <NumericalInputMax
          value={userInput}
          radius="small"
          variant="secondary"
          onUserInput={setUserInput}
          onMax={() => {
              setUserInput(lpBalance.replaceAll(',', ''));
          }}
        />
      </Flex>
      {showApproveFlow ? (
        <ActionButton
          width="100%"
          disabled={approveTokenButtonDisabled || !userInput || !isEnoughtBalanceToApprove || !isValidateInput}
          style={{
            fontSize: '14px',
          }}
          onSubmit={handleApprove}
        >
          {isApprovePending ? <Dots>Enabling</Dots> : <Trans>Enable {details?.lpSymbol}</Trans>}
        </ActionButton>
      ) : (
        <ActionButton
          width="100%"
          disabled={!userInput || submitting || !isValidateInput}
          style={{
            fontSize: '14px',
          }}
          onSubmit={handleStake}
        >
          {submitting ? <Dots>Staking</Dots> : 'Stake LP'}
        </ActionButton>
      )}
    </Wrapper>
  );
};

export default FarmStake;
