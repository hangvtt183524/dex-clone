import chunk from 'lodash/chunk';
import { SupportedChainId } from 'config/sdk-core';
import { multicallv2 } from 'packages/multicall/utils';
import { STAKING_MANAFER_ABI } from 'config/abis';
import BigNumber from 'bignumber.js';
import {serializedToken} from '../../../utils/tokens';
import { FARM_REWARDS, WRAPPED_NATIVE_CURRENCY } from '../../../config/tokens';

const fetchPoolLengthAndRewardCalls = (manager: string) => {
    return [
        {
            address: manager,
            name: 'getPoolLength',
            params: [],
        },
        {
            address: manager,
            name: 'rewardToken',
            params: [],
        }
    ];
};

const fetchPoolInfoCalls = (manager: string, poolLength: number) => {
    const poolInfoCalls = [];

    for (let index = 0; index < poolLength; index++) {
        poolInfoCalls.push({
            address: manager,
            name: 'pools',
            params: [index],
        });
    }

    return poolInfoCalls;
}

export const fetchFarmBaseData = async (
    farmAddresses: string[] = [],
    chainId: SupportedChainId = SupportedChainId.MAINNET,
): Promise<any[]> => {
    const calls = farmAddresses.flatMap((address) => fetchPoolLengthAndRewardCalls(address));
    const poolLengthAndStakeMultiCallResult = await multicallv2({
        abi: STAKING_MANAFER_ABI,
        calls,
        chainId,
    });
    
    const poolLengthChunkedResultRaw = chunk(poolLengthAndStakeMultiCallResult, calls.flat().length / farmAddresses.length);

    const stakingTokens = {};
    const poolInfoCalls = poolLengthChunkedResultRaw.flatMap((poolLengthAndStake, index) => {
        stakingTokens[farmAddresses[index]] = poolLengthAndStake[1][0].toLowerCase();
        return fetchPoolInfoCalls(farmAddresses[index], poolLengthAndStake[0][0].toNumber());
    });

    const poolInfoMultiCallResult = await multicallv2({
        abi: STAKING_MANAFER_ABI,
        calls: poolInfoCalls,
        chainId,
    });

    const poolInfoChunkedResultRaw = chunk(poolInfoMultiCallResult, 1);

    const farmBaseResult = []
    poolInfoChunkedResultRaw.forEach((poolInfo, index) => {
        const farmBaseResultBaseOnManager = farmBaseResult.find((result) => result.manager === poolInfoCalls[index].address);
        if (farmBaseResultBaseOnManager) {
            farmBaseResultBaseOnManager.pools.push({
                pid: poolInfoCalls[index].params[0],
                lpAddress: poolInfo[0] ? poolInfo[0][0] : '',
                decimals: 18,
                token: serializedToken(FARM_REWARDS[chainId].FLOWER),
                quoteToken: serializedToken(WRAPPED_NATIVE_CURRENCY[chainId]),
                locktime: poolInfo[0] ? poolInfo[0][2].toNumber() : 0,
            })
        } else {
            farmBaseResult.push({
                manager: poolInfoCalls[index].address,
                rewards: [stakingTokens[poolInfoCalls[index].address]],
                pools: [
                    {
                        pid: poolInfoCalls[index].params[0],
                        lpAddress: poolInfo[0] ? poolInfo[0][0] : '',
                        decimals: 18,
                        token: serializedToken(FARM_REWARDS[chainId].FLOWER),
                        quoteToken: serializedToken(WRAPPED_NATIVE_CURRENCY[chainId]),
                        locktime: poolInfo[0] ? poolInfo[0][2].toNumber() : 0,
                    }
                ]
            })
        }
    });

    return farmBaseResult;
};