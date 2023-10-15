/* eslint-disable max-len */
import { Interface } from '@ethersproject/abi';
import ERC20_ABI from './abi/Erc20.json';
import ERC20_BYTES32_ABI from './abi/Erc20Bytes32.json';
import EIP_2612_ABI from './abi/eip_2612.json';

import WETH_ABI from './abi/Weth.json';
import PAIR_API from './abi/Pair.json';

import ROUTER_02_ABI from './abi/Router02.json';
import ROUTER_V2_02_ABI from './abi/RouterV2_02.json';

import STAKING_REWARD_ABI from './abi/StakingReward.json';

import QUOTER_ABI from './abi/Quoter.json';
import QUOTER_V2_ABI from './abi/QuoterV2.json';

import POOL_V3_STATE_ABI from './abi/PoolV3State.json';

// farms
import STAKING_MANAFER_ABI from './abi/StakingManager.json';

import MULTICALL_ABI from './abi/Multicall.json';

import PERMIT2_ABI from './abi/PERMIT2.json';

const IERC20 = new Interface(ERC20_ABI);
const IERC20_BYTES32 = new Interface(ERC20_BYTES32_ABI);
const IEIP_2612 = new Interface(EIP_2612_ABI);

const IMULTICALL = new Interface(MULTICALL_ABI);

const IWETH = new Interface(WETH_ABI);
const IPAIR = new Interface(PAIR_API);
const IROUTER_02 = new Interface(ROUTER_02_ABI);
const IROUTER_V2_02 = new Interface(ROUTER_V2_02_ABI);

const ISTAKING_REWARD = new Interface(STAKING_REWARD_ABI);

const IQUOTER = new Interface(QUOTER_ABI);
const IQUOTER_V2 = new Interface(QUOTER_V2_ABI);
const IPOOL_V3_STATE = new Interface(POOL_V3_STATE_ABI);

const ISTAKING_MANAFER = new Interface(STAKING_MANAFER_ABI);

const IPERMIT2 = new Interface(PERMIT2_ABI);

export {
  // token
  ERC20_ABI,
  IERC20,
  ERC20_BYTES32_ABI,
  IERC20_BYTES32,
  EIP_2612_ABI,
  IEIP_2612,
  WETH_ABI,
  IWETH,

  // multicall
  MULTICALL_ABI,
  IMULTICALL,

  // SWAP , ROUTER
  PAIR_API,
  IPAIR,
  POOL_V3_STATE_ABI,
  IPOOL_V3_STATE,
  ROUTER_02_ABI,
  IROUTER_02,
  ROUTER_V2_02_ABI,
  IROUTER_V2_02,
  STAKING_REWARD_ABI,
  ISTAKING_REWARD,
  QUOTER_ABI,
  IQUOTER,
  QUOTER_V2_ABI,
  IQUOTER_V2,

  // farms
  ISTAKING_MANAFER,
  STAKING_MANAFER_ABI,

  // PERMIT
  PERMIT2_ABI,
  IPERMIT2,
};
