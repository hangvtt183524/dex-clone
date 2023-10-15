import { ParsedUrlQuery } from 'querystring';
import { DEFAULT_INPUT_CURRENCY, DEFAULT_OUTPUT_CURRENCY, NATIVE_TOKEN } from 'config/tokens';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'state/store';
import { Field, replaceSwapState } from 'state/swap/actions';
import { SwapState } from 'state/swap/reducer';
import { isAddress } from 'utils/addressHelpers';

import { SupportedChainId } from 'config/sdk-core';
import { replaceParamHistory } from 'utils/urlHelper';
import { useSelectedChainNetwork } from '../user/hooks';

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam);
    if (valid) return valid;
    if (urlParam.toUpperCase() === 'ETH') return 'ETH';
    if (valid === false) return 'ETH';
  }
  return '';
}

function parseCurrencyAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !Number.isNaN(parseFloat(urlParam)) ? urlParam : '';
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT;
}

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null;
  const address = isAddress(recipient);
  if (address) return address;
  if (ADDRESS_REGEX.test(recipient)) return recipient;
  return null;
}

export function queryParametersToSwapState(parsedQs: ParsedUrlQuery, chainId: SupportedChainId): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency) || DEFAULT_INPUT_CURRENCY[chainId];
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency) || DEFAULT_OUTPUT_CURRENCY[chainId];

  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = '';
    } else {
      outputCurrency = '';
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient);
  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseCurrencyAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
    pairDataById: {},
    derivedPairDataById: {},
  };
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | {
      inputCurrencyId: string | undefined;
      outputCurrencyId: string | undefined;
    }
  | undefined {
  const chainId = useSelectedChainNetwork();
  const dispatch = useAppDispatch();
  const { query } = useRouter();
  const [result, setResult] = useState<
    | {
        inputCurrencyId: string | undefined;
        outputCurrencyId: string | undefined;
        chainId: number;
      }
    | undefined
  >();

  useEffect(() => {
    if (!NATIVE_TOKEN[chainId]) return;
    const _query = { ...query };

    if (result?.chainId !== chainId) {
      replaceParamHistory('inputCurrency', '');
      replaceParamHistory('outputCurrency', '');
      delete _query.inputCurrency;
      delete _query.outputCurrency;
    }

    const parsed = queryParametersToSwapState(_query, chainId);

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId?.toLowerCase(),
        outputCurrencyId: parsed[Field.OUTPUT].currencyId?.toLowerCase(),
        recipient: null,
      }),
    );

    setResult({
      inputCurrencyId: parsed[Field.INPUT].currencyId?.toLowerCase(),
      outputCurrencyId: parsed[Field.OUTPUT].currencyId?.toLowerCase(),
      chainId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId, query]);

  return result;
}

export const usePinTokens = () => {
  const pinTokens = useAppSelector((state) => state.user.pinTokens);
  return useMemo(() => pinTokens, [pinTokens]);
};
