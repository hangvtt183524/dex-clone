import { Contract } from '@ethersproject/contracts';

import { TransactionResponse } from '@ethersproject/providers';

export const harvestFarm = async (masterChefContract, pid) => {
  return masterChefContract.harvestRewards(pid);
};

export const stakeFarm = async (masterChefContract: Contract, pid, amount): Promise<TransactionResponse> => {
  return masterChefContract.deposit(pid, amount);
};

export const unstakeFarm = async (masterChefContract: Contract, pid, amount): Promise<TransactionResponse> => {
  return masterChefContract.withdraw(pid, amount);
};
