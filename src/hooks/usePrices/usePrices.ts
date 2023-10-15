// type UsePrices = ({
//   chainId,
//   options,
// }: {
//   chainId?: ChainId
//   options?: UseQueryOptions<string, unknown, Record<string, number> | undefined, string[]>
// }) => Pick<ReturnType<typeof useQuery>, 'isLoading' | 'isError'> & { data: Record<string, Fraction> | undefined }

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { useMemo } from 'react';
import { generateQueryString } from 'utils/urlHelper';
import { networks } from 'config/networks';
import { Token } from 'config/sdk-core';

const routingPrice = createApi({
  reducerPath: 'routingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://57uw0dbllc.execute-api.us-east-1.amazonaws.com/',
    headers: {
      'content-type': '*',
    },
  }),
  endpoints: (build) => ({
    getQuote: build.query<
      any,
      {
        token: string;
        tokenBase: string;
        network: string;
      }
    >({
      async queryFn(args, _api, _extraOptions, fetch) {
        const { token, tokenBase, network } = args;
        const result = await fetch(
          generateQueryString('Prod/api/v1/price/token', {
            token,
            tokenBase,
            network,
          }),
        );
        return result;
      },
      extraOptions: {
        maxRetries: 0,
      },
    }),
  }),
});
export const { useGetQuoteQuery, usePrefetch } = routingPrice;

export const usePrices = ({ chainId, token }: { chainId?: number; token: Token }) => {
  const { data, isError, isLoading } = useGetQuoteQuery({
    network: networks[chainId].roboApiID,
    token: token.address,
    tokenBase: token.address,
  });

  return useMemo(() => {
    return {
      isError,
      isLoading,
      data,
    };
  }, [isError, isLoading, data]);
};
