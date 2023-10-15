import { IChainID } from 'config/networks';
import { SupportedChainId } from 'config/sdk-core';

export const CHAIN_ID =
  (parseInt(process.env.NEXT_PUBLIC_CHAIN_ID, 10) as unknown as IChainID) || SupportedChainId.MAINNET;

export const CHAIN_ID_DEFAULT =  SupportedChainId.MAINNET;

export const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;
if (typeof INFURA_KEY === 'undefined') {
  throw new Error('REACT_APP_INFURA_KEY must be a defined environment variable');
}

export const API_QUOTE = process.env.NEXT_PUBLIC_API_QUOTE;
export const PRICE_CHART_API = process.env.REACT_APP_PRICE_CHART_API || 'https://price-chart.kyberswap.com/api';

export const SERVER_URL = process.env.NEXT_PUBLIC_WEB_URL || 'bjazzy-lily-0687d3.netlify.app/swap';