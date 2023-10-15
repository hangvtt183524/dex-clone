import { FixedNumber } from '@ethersproject/bignumber';

export const FIXED_ZERO = FixedNumber.from(0);
export const FIXED_ONE = FixedNumber.from(1);
export const FIXED_TWO = FixedNumber.from(2);

export const FARM_AUCTION_HOSTING_IN_SECONDS = 691200;

export const nonBSCVaultAddresses = {
  1: '0x2e71B2688019ebdFDdE5A45e6921aaebb15b25fb',
  5: '0xE6c904424417D03451fADd6E3f5b6c26BcC43841',
};

export const BSC_BLOCK_TIME = 3;
export const CAKE_PER_BLOCK = 40;
export const BLOCKS_PER_DAY = (60 / BSC_BLOCK_TIME) * 60 * 24;
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365; // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK * BLOCKS_PER_YEAR;

export const REWARDS_PRECISION = 1e12;
