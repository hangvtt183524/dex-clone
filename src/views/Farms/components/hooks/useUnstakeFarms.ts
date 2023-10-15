import { useStakingManagerContract } from 'hooks/useContract';
import { useCallback, useMemo } from 'react';
import { useFetchFarmWithUserData } from 'state/farms/hooks';
import { unstakeFarm } from 'state/farms/utils';
import { useCallbackTransactionHash, useTransactionAdder } from 'state/transactions/hooks';
import { TransactionType } from 'state/transactions/types';
import { useSelectedChainNetwork } from 'state/user/hooks';

const useUnstakeFarms = (managerAddress: string, pid: number) => {
  const stakingManagerContract = useStakingManagerContract(managerAddress, true);
  const addTransaction = useTransactionAdder();
  const refrech = useFetchFarmWithUserData();
  const chainId = useSelectedChainNetwork();

  const handleRefech = useCallback(() => {
    refrech();
  }, [refrech]);

  const { callbackHash, pendingTxn } = useCallbackTransactionHash(handleRefech);

  const handleUnstake = useCallback(
    async (amount: string) => {
      return unstakeFarm(stakingManagerContract, pid).then((response) => {
        if (response.hash) callbackHash(response.hash);

        addTransaction(response, {
          type: TransactionType.UNSTAKE_FARM,
          amount,
          pid,
          manager: managerAddress,
          chainId,
        });

        return response;
      });
    },
    [stakingManagerContract, pid, callbackHash, addTransaction, managerAddress, chainId],
  );

  return useMemo(() => ({ onUnstake: handleUnstake, pendingTxn }), [handleUnstake, pendingTxn]);
};

export default useUnstakeFarms;
