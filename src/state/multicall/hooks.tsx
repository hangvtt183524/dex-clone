/* eslint-disable camelcase */
/* eslint-disable default-param-last */
import { FunctionFragment, Interface } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { CHAIN_ID } from 'config/env';

import { useCallback, useEffect, useMemo } from 'react';
import { useCurrentBlock } from 'state/block/hooks';
import { useAppDispatch, useAppSelector } from 'state/store';
import {
  Call,
  ListenerOptions,
  addMulticallListeners,
  parseCallKey,
  removeMulticallListeners,
  toCallKey,
} from './actions';
import { useSelectedChainNetwork } from '../user/hooks';

export interface Result extends ReadonlyArray<any> {
  readonly [key: string]: any;
}

type MethodArg = string | number | BigNumber;
type MethodArgs = Array<MethodArg | MethodArg[]>;

type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined;

function isMethodArg(x: unknown): x is MethodArg {
  return ['string', 'number'].indexOf(typeof x) !== -1;
}

function isValidMethodArgs(x: unknown): x is MethodArgs | undefined {
  return (
    x === undefined ||
    (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
  );
}

interface CallResult {
  readonly valid: boolean;
  readonly data: string | undefined;
  readonly blockNumber: number | undefined;
}

const INVALID_RESULT: CallResult = { valid: false, blockNumber: undefined, data: undefined };

// use this options object
export const NEVER_RELOAD: ListenerOptions = {
  blocksPerFetch: Infinity,
};

// the lowest level call for subscribing to contract data
function useCallsData(calls: (Call | undefined)[], chainId = CHAIN_ID, options?: ListenerOptions): CallResult[] {
  const callResults = useAppSelector((state) => state.multicall.callResults);
  const dispatch = useAppDispatch();

  const serializedCallKeys: string = useMemo(
    () =>
      JSON.stringify(
        calls
          ?.filter((c): c is Call => Boolean(c))
          ?.map(toCallKey)
          ?.sort() ?? [],
      ),
    [calls],
  );

  // update listeners when there is an actual change that persists for at least 100ms
  useEffect(() => {
    const callKeys: string[] = JSON.parse(serializedCallKeys);
    if (!chainId || callKeys.length === 0) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const calls = callKeys.map((key) => parseCallKey(key));
    dispatch(
      addMulticallListeners({
        chainId,
        calls,
        options,
      }),
    );

    return () => {
      dispatch(
        removeMulticallListeners({
          chainId,
          calls,
          options,
        }),
      );
    };
  }, [chainId, dispatch, options, serializedCallKeys]);

  return useMemo(
    () =>
      calls.map<CallResult>((call) => {
        if (!chainId || !call) return INVALID_RESULT;

        const result = callResults[chainId]?.[toCallKey(call)];
        let data;
        if (result?.data && result?.data !== '0x') {
          // eslint-disable-next-line prefer-destructuring
          data = result.data;
        }

        return { valid: true, data, blockNumber: result?.blockNumber };
      }),
    [callResults, calls, chainId],
  );
}

interface CallState {
  readonly valid: boolean;
  // the result, or undefined if loading or errored/no data
  readonly result: Result | undefined;
  // true if the result has never been fetched
  readonly loading: boolean;
  // true if the result is not for the latest block
  readonly syncing: boolean;
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean;
}

const INVALID_CALL_STATE: CallState = { valid: false, result: undefined, loading: false, syncing: false, error: false };
const LOADING_CALL_STATE: CallState = { valid: true, result: undefined, loading: true, syncing: true, error: false };

function toCallState(
  callResult: CallResult | undefined,
  contractInterface: Interface | undefined,
  fragment: FunctionFragment | undefined,
  latestBlockNumber: number | undefined,
): CallState {
  if (!callResult) return INVALID_CALL_STATE;
  const { valid, data, blockNumber } = callResult;
  if (!valid) return INVALID_CALL_STATE;
  if (valid && !blockNumber) return LOADING_CALL_STATE;
  if (!contractInterface || !fragment || !latestBlockNumber) return LOADING_CALL_STATE;
  const success = data && data.length > 2;
  const syncing = (blockNumber ?? 0) < latestBlockNumber;
  let result: Result | undefined;
  if (success && data) {
    try {
      result = contractInterface.decodeFunctionResult(fragment, data);
    } catch (error) {
      console.debug('Result data parsing failed', fragment, data);
      return {
        valid: true,
        loading: false,
        error: true,
        syncing,
        result,
      };
    }
  }
  return {
    valid: true,
    loading: false,
    syncing,
    result,
    error: !success,
  };
}

export function useSingleContractMultipleData(
  contract: Contract | null | undefined,
  methodName: string,
  callInputs: OptionalMethodInputs[],
  options?: ListenerOptions,
): CallState[] {
  const chainId = useSelectedChainNetwork();

  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName]);

  const calls = useMemo(
    () =>
      contract && fragment && callInputs && callInputs.length > 0
        ? callInputs.map<Call>((inputs) => {
            return {
              address: contract.address,
              callData: contract.interface.encodeFunctionData(fragment, inputs),
            };
          })
        : [],
    [callInputs, contract, fragment],
  );

  const results = useCallsData(calls, chainId, options);

  const currentBlock = useCurrentBlock();

  return useMemo(() => {
    return results.map((result) => toCallState(result, contract?.interface, fragment, currentBlock));
  }, [fragment, contract, results, currentBlock]);
}

export function useMultipleContractSingleData(
  addresses: (string | undefined)[],
  contractInterface: Interface,
  methodName: string,
  callInputs?: OptionalMethodInputs,
  options?: ListenerOptions,
): CallState[] {
  const chainId = useSelectedChainNetwork();

  const fragment = useMemo(() => contractInterface.getFunction(methodName), [contractInterface, methodName]);
  const callData: string | undefined = useMemo(
    () =>
      fragment && isValidMethodArgs(callInputs)
        ? contractInterface.encodeFunctionData(fragment, callInputs)
        : undefined,
    [callInputs, contractInterface, fragment],
  );

  const calls = useMemo(
    () =>
      fragment && addresses && addresses.length > 0 && callData
        ? addresses.map<Call | undefined>((address) => {
            return address && callData
              ? {
                  address,
                  callData,
                }
              : undefined;
          })
        : [],
    [addresses, callData, fragment],
  );
  const results = useCallsData(calls, chainId, options);

  const currentBlock = useCurrentBlock();

  return useMemo(() => {
    return results.map((result) => toCallState(result, contractInterface, fragment, currentBlock));
  }, [fragment, results, contractInterface, currentBlock]);
}

export function useSingleCallResult(
  contract: Contract | null | undefined,
  methodName: string,
  inputs?: OptionalMethodInputs,
  options?: ListenerOptions,
): CallState {
  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName]);
  const currentBlock = useCurrentBlock();

  const calls = useMemo<Call[]>(() => {
    return contract && fragment && isValidMethodArgs(inputs)
      ? [
          {
            address: contract.address,
            callData: contract.interface.encodeFunctionData(fragment, inputs),
          },
        ]
      : [];
  }, [contract, fragment, inputs]);
  const chainId = useSelectedChainNetwork();
  const result = useCallsData(calls, chainId, options)[0];

  return useMemo(() => {
    return toCallState(result, contract?.interface, fragment, currentBlock);
  }, [result, contract?.interface, fragment, currentBlock]);
}

function useCallStates(
  results: CallResult[],
  contractInterface: Interface | undefined,
  fragment: ((i: number) => FunctionFragment | undefined) | FunctionFragment | undefined,
  latestBlockNumber: number | undefined,
): CallState[] {
  const syncingBlockNumber = useMemo(() => {
    const lowestBlockNumber = results.reduce<number | undefined>(
      (memo, result) => (result.blockNumber ? Math.min(memo ?? result.blockNumber, result.blockNumber) : memo),
      undefined,
    );
    return Math.max(lowestBlockNumber ?? 0, latestBlockNumber ?? 0);
  }, [results, latestBlockNumber]);

  return useMemo(() => {
    return results.map((result, i) => {
      const resultFragment = typeof fragment === 'function' ? fragment(i) : fragment;
      return toCallState(result, contractInterface, resultFragment, syncingBlockNumber);
    });
  }, [contractInterface, fragment, results, syncingBlockNumber]);
}

export const useSingleContractWithCallData = (
  contract: Contract | null | undefined,
  callDatas: string[],
  options?: ListenerOptions,
): CallState[] => {
  const chainId = useSelectedChainNetwork();

  const calls = useMemo(() => {
    if (!contract) return [];
    return callDatas.map<Call>((callData) => ({
      address: contract.address,
      callData,
    }));
  }, [callDatas, contract]);
  const results = useCallsData(calls, chainId, options);
  const currentBlock = useCurrentBlock();

  const fragment = useCallback(
    (i: number) => contract?.interface?.getFunction(callDatas[i].substring(0, 10)),
    [callDatas, contract],
  );

  return useCallStates(results, contract?.interface, fragment, currentBlock);
};
