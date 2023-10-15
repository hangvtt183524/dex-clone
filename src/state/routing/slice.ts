import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
// import { AlphaRouter, ChainId } from '@uniswap/smart-order-router';
import { API_QUOTE } from 'config/env';
import { SupportedChainId } from 'config/sdk-core';
import qs from 'qs';

import { GetQuoteResult } from './types';

export enum RouterPreference {
  API = 'api',
  CLIENT = 'client',
  PRICE = 'price',
}

// const routers = new Map<ChainId, AlphaRouter>();
// function getRouter(chainId: ChainId): AlphaRouter {
//   const router = routers.get(chainId);

//   if (router) return router;
//   const supportedChainId = isSupportedChainId(chainId as any);
//   if (supportedChainId) {
//     /*
//       POST http://localhost:8545/ net::ERR_CONNECTION_REFUSED
//       Cannot read properties of undefined (reading 'subscriptions')
//       Cannot read properties of undefined (reading 'getBlockNumber')

//       you will get these errors when provider is null
//     */
//     const provider = RPC_PROVIDERS[chainId];

//     const router = new AlphaRouter({ chainId, provider });

//     routers.set(chainId, router);
//     return router;
//   }

//   throw new Error(`Router does not support this chain (chainId: ${chainId}).`);
// }

// routing API quote params: https://github.com/Uniswap/routing-api/blob/main/lib/handlers/quote/schema/quote-schema.ts
const API_QUERY_PARAMS = {
  protocols: 'v2', // 'v2,v3,mixed',
};
// const CLIENT_PARAMS = {
//   protocols: [Protocol.V2], // Protocol.V3, Protocol.MIXED
// };

export const routingApi = createApi({
  reducerPath: 'routingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_QUOTE,
    headers: {
      'content-type': '*',
    },
  }),
  endpoints: (build) => ({
    getQuote: build.query<
      GetQuoteResult,
      {
        tokenInAddress: string;
        tokenInChainId: SupportedChainId;
        tokenInDecimals: number;
        tokenInSymbol?: string;
        tokenOutAddress: string;
        tokenOutChainId: SupportedChainId;
        tokenOutDecimals: number;
        tokenOutSymbol?: string;
        amount: string;
        routerPreference: RouterPreference;
        type: 'exactIn' | 'exactOut';
      }
    >({
      async queryFn(args, _api, _extraOptions, fetch) {
        const { tokenInAddress, tokenInChainId, tokenOutAddress, tokenOutChainId, amount, routerPreference, type } =
          args;
        let result;

        try {
          if (routerPreference === RouterPreference.API) {
            const query = qs.stringify({
              ...API_QUERY_PARAMS,
              tokenInAddress,
              tokenInChainId,
              tokenOutAddress,
              tokenOutChainId,
              amount,
              type,
            });
            result = await fetch(`quotes/uniswap?${query}`);
          }
          // else if (routerPreference === RouterPreference.PRICE) {
          //   const router = getRouter(args.tokenInChainId as unknown as ChainId);
          //   result = await getClientSideQuote(args, router, CLIENT_PARAMS);
          // }
          return { data: result?.data as GetQuoteResult };
        } catch (e) {
          return { error: e as FetchBaseQueryError };
        }
      },
      extraOptions: {
        maxRetries: 0,
      },
    }),
  }),
});

export const { useGetQuoteQuery, usePrefetch } = routingApi;
