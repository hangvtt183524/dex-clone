import { useStakingManagerContract } from 'hooks/useContract';
import { useCallback, useMemo } from 'react';
import { useFetchFarmWithUserData } from 'state/farms/hooks';
import { useCallbackTransactionHash, useTransactionAdder } from 'state/transactions/hooks';
import { TransactionType } from 'state/transactions/types';
import { harvestFarm } from 'state/farms/utils';
import { useSelectedChainNetwork } from 'state/user/hooks';

const useHarvestFarm = (managerAddress: string, pid: number) => {
  const stakingManagerContract = useStakingManagerContract(managerAddress, true);
  const chainId = useSelectedChainNetwork();

  const addTransaction = useTransactionAdder();
  const refrech = useFetchFarmWithUserData();

  const handleRefech = useCallback(() => {
    refrech();
  }, [refrech]);

  const { callbackHash, pendingTxn } = useCallbackTransactionHash(handleRefech);

  const handleHarvest = useCallback(
    async (amount: string) => {
      return harvestFarm(stakingManagerContract, pid).then((response) => {
        if (response.hash) callbackHash(response.hash);
        addTransaction(response, {
          type: TransactionType.HARVEST_FARM,
          pid,
          amount,
          manager: managerAddress,
          chainId,
        });

        return response;
      }).catch((error) => {
          console.log('error when check staking contract: ', error)
      });
    },
    [stakingManagerContract, pid, callbackHash, addTransaction, managerAddress, chainId],
  );

  return useMemo(() => ({ onReward: handleHarvest, pendingTxn }), [handleHarvest, pendingTxn]);
};

export default useHarvestFarm;
