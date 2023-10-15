import { Contract } from '@ethersproject/contracts';
import { TransactionResponse } from '@ethersproject/providers';

export const stakeFarm = async (masterChefContract: Contract, pid, amount): Promise<TransactionResponse> => {
  return masterChefContract.deposit(pid, amount);
};

export const unstakeFarm = async (masterChefContract: Contract, pid): Promise<TransactionResponse> => {
  return masterChefContract.emergencyWithdraw(pid);
};

export const harvestFarm = async (masterChefContract: Contract, pid): Promise<TransactionResponse> => {
  return masterChefContract.harvestRewards(pid);
};
