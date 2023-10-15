import { Interface } from '@ethersproject/abi';
import { CallOverrides } from '@ethersproject/contracts';
import { Provider } from '@ethersproject/providers';
import { SupportedChainId } from 'config/sdk-core';
import { CHAIN_ID } from 'config/env';
import { getMulticallContract } from 'utils/contractHelpers';

export interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (example: balanceOf)
  params?: any[]; // Function params
}

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean;
}

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
 */
interface MulticallV2Params {
  abi: any[];
  calls: Call[];
  chainId?: SupportedChainId;
  options?: MulticallOptions;
  provider?: Provider;
}

export interface CallV3 extends Call {
  abi: any[];
  allowFailure?: boolean;
}

export type MultiCallV2 = <T = any>(params: MulticallV2Params) => Promise<T>;
export type MultiCall = <T = any>(abi: any[], calls: Call[], chainId?: SupportedChainId) => Promise<T>;

export function createMulticall() {
  const multicall: MultiCall = async (abi: any[], calls: Call[], chainId = CHAIN_ID as unknown as SupportedChainId) => {
    const multi = getMulticallContract(chainId);
    if (!multi) throw new Error(`Multicall Provider missing for ${chainId}`);
    const itf = new Interface(abi);

    const calldata = calls.map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }));
    try {
      const { returnData } = await multi.callStatic.aggregate(calldata);

      const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call));

      return res as any;
    } catch (e) {
      console.info('calls 1:', calls);
      console.error('ERROR: v1', e);
    }
  };

  const multicallv2: MultiCallV2 = async ({ abi, calls, chainId = CHAIN_ID, options, provider: _provider }) => {
    const { requireSuccess = true, ...overrides } = options || {};
    const multi = getMulticallContract(chainId);
    if (!multi) throw new Error(`Multicall Provider missing for ${chainId}`);
    const itf = new Interface(abi);

    const calldata = calls.map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }));

    try {
      const returnData = await multi.callStatic.tryAggregate(requireSuccess, calldata, overrides);
      const res = returnData.map((call, i) => {
        const [result, data] = call;
        return result ? itf.decodeFunctionResult(calls[i].name, data) : null;
      });

      return res as any;
    } catch (e) {
      console.error('ERROR: v2', e);
    }
  };

  // const multicallv3 = async ({
  //   calls,
  //   chainId = CHAIN_ID as unknown as SupportedChainId,
  //   allowFailure,
  //   overrides,
  // }: MulticallV3Params) => {
  //   const multi = getMulticallContract(chainId);
  //   if (!multi) throw new Error(`Multicall Provider missing for ${chainId}`);
  //   const _calls = calls.map(({ abi, address, name, params, allowFailure: _allowFailure }) => {
  //     const contract = new Contract(address, abi);
  //     const callData = contract.interface.encodeFunctionData(name, params ?? []);
  //     if (!contract[name]) console.error(`${name} missing on ${address}`);
  //     return {
  //       target: address,
  //       allowFailure: allowFailure || _allowFailure,
  //       callData,
  //     };
  //   });

  //   const result = await multi.callStatic.aggregate3([...[_calls], ...(overrides ? [overrides] : [])] as any);

  //   return result.map((call, i) => {
  //     const { returnData, success } = call;
  //     if (!success || returnData === '0x') return null;
  //     const { address, abi, name } = calls[i];
  //     const contract = new Contract(address, abi);
  //     const decoded = contract.interface.decodeFunctionResult(name, returnData);
  //     return decoded;
  //   });
  // };

  return {
    multicall,
    multicallv2,
    // multicallv3,
  };
}
