import { useStakingManagerContract } from 'hooks/useContract';
import { useCallback, useMemo, useState } from 'react';
import { useFetchFarmWithUserData } from 'state/farms/hooks';
import { stakeFarm } from 'state/farms/utils';
import { useCallbackTransactionHash, useTransactionAdder } from 'state/transactions/hooks';
import { TransactionType } from 'state/transactions/types';
import { useSelectedChainNetwork } from 'state/user/hooks';

const useStakeFarms = (managerAddress: string, pid: number) => {
    const chainId = useSelectedChainNetwork();

  const stakingManagerContract = useStakingManagerContract(managerAddress, true);
  const addTransaction = useTransactionAdder();

  const refrech = useFetchFarmWithUserData();

  const [submitting, setSubmitting] = useState(false);

  const handleRefech = useCallback(() => refrech(), [refrech]);

  const { callbackHash } = useCallbackTransactionHash(handleRefech);

  const handleStake = useCallback(
    async (amount: string) => {
      setSubmitting(true);
      return stakeFarm(stakingManagerContract, pid, amount)
        .then((response) => {
          if (response.hash) callbackHash(response.hash);
          setSubmitting(false);
          addTransaction(response, {
            type: TransactionType.STAKE_FARM,
            amount,
            pid,
            manager: managerAddress,
            chainId,
          });

          return response;
        })
        .catch((error) => {
          console.error(error);
          setSubmitting(false);
        });
    },
    [stakingManagerContract, pid, callbackHash, addTransaction, managerAddress, chainId],
  );

  return useMemo(() => ({ onStake: handleStake, submitting }), [handleStake, submitting]);
};

export default useStakeFarms;
