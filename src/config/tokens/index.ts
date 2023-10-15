import {
  mapTokenFromListDefault,
  mapTokensWithSymbolToAllChain,
  mapTokensWithSymbolsToAllChain,
} from 'utils/tokenHelpers';
import { SupportedChainId, CurrencyAmount, Token, WETH9 } from 'config/sdk-core';
import { Native } from 'config/native';
import { getFullDecimals } from 'utils/numbersHelper';
import { ChainTokenList, TokenByChain, TokenSymbolByChain } from '../types/token';

// ADD NETWORK
export const NATIVE_TOKEN: { [chain in SupportedChainId]: Native } = {
  // ETHEREUM
  [SupportedChainId.MAINNET]: new Native(SupportedChainId.MAINNET, 18, 'ETH', 'Ethereum'),
  [SupportedChainId.SEPOLIA]: new Native(SupportedChainId.SEPOLIA, 18, 'ETH', 'Sepolia Ether'),

  // BSC
  [SupportedChainId.BSC]: new Native(SupportedChainId.BSC, 18, 'BNB', 'Binance Chain Native Token'),
  [SupportedChainId.BSC_TESTNET]: new Native(
    SupportedChainId.BSC_TESTNET,
    18,
    'BNB',
    'Binance Chain Testnet Native Token',
  ),

  // POLYGON
  [SupportedChainId.POLYGON]: new Native(SupportedChainId.POLYGON, 18, 'MATIC', 'MATIC'),
  [SupportedChainId.POLYGON_MUMBAI]: new Native(SupportedChainId.POLYGON_MUMBAI, 18, 'MATIC', 'MATIC'),
};

export const WRAPPED_NATIVE_CURRENCY: TokenByChain = {
  ...(WETH9 as any),
  [SupportedChainId.POLYGON]: new Token(
    SupportedChainId.POLYGON,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    18,
    'WMATIC',
    'Wrapped MATIC',
  ),
  [SupportedChainId.POLYGON_MUMBAI]: new Token(
    SupportedChainId.POLYGON_MUMBAI,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'WMATIC',
    'Wrapped MATIC',
  ),
  [SupportedChainId.BSC]: new Token(
    SupportedChainId.BSC,
    '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB',
  ),
  [SupportedChainId.BSC_TESTNET]: new Token(
    SupportedChainId.BSC_TESTNET,
    '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    18,
    'WBNB',
    'Wrapped BNB',
  ),
};

export const FARM_REWARDS = {
  [SupportedChainId.MAINNET]: {
    FLOWER: new Token(SupportedChainId.MAINNET, '0x3eC2D841927eFc512A8618BAE208572a6C88FAb5', 18, 'FLOWER', 'FLOWER'),
    SHIBA: new Token(SupportedChainId.MAINNET, '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', 18, 'SHIB', 'SHIBA INU'),
    RFDB: new Token(SupportedChainId.MAINNET, '0x71b849c6e59b6aba5141e81417632004f9153fb3', 9, 'RFDB', 'RFDB'),
  },
  [SupportedChainId.SEPOLIA]: {
      FLOWER: new Token(SupportedChainId.SEPOLIA, '0x41Ddf33AAd71b9aA1354848BFd6bc687E2c6Ab42', 18, 'FLOWER', 'FLOWER'),
      SHIBA: new Token(SupportedChainId.SEPOLIA, '0x6d9A266C281fDBf1e1917F784F3FEBe74E03B2Da', 18, 'SHIB', 'SHIBA INU'),
  },
};

// ADD NETWORK
export const TOKENS: TokenSymbolByChain = {
  [SupportedChainId.MAINNET]: mapTokenFromListDefault(SupportedChainId.MAINNET),
  [SupportedChainId.SEPOLIA]: mapTokenFromListDefault(SupportedChainId.SEPOLIA),
  [SupportedChainId.POLYGON]: mapTokenFromListDefault(SupportedChainId.POLYGON),
  [SupportedChainId.POLYGON_MUMBAI]: mapTokenFromListDefault(SupportedChainId.POLYGON_MUMBAI),

  [SupportedChainId.BSC]: mapTokenFromListDefault(SupportedChainId.BSC),
  [SupportedChainId.BSC_TESTNET]: mapTokenFromListDefault(SupportedChainId.BSC_TESTNET),
} as const;

export const BAD_SRCS = [];

export const USDT: TokenByChain = {
  ...mapTokensWithSymbolToAllChain('USDT'),
  ...mapTokensWithSymbolToAllChain('tUSDT'),
};
export const USDC: TokenByChain = {
  ...mapTokensWithSymbolToAllChain('USDC'),
  ...mapTokensWithSymbolToAllChain('tUSDC'),
};
export const SHIB: TokenByChain = {
  ...mapTokensWithSymbolToAllChain('SHIB'),
};
export const BUSD: TokenByChain = {
  ...mapTokensWithSymbolToAllChain('BUSD'),
  ...mapTokensWithSymbolToAllChain('tBUSD'),
};

export const DAI: TokenByChain = {
  ...mapTokensWithSymbolToAllChain('DAI'),
};

export const STABLECOIN = mapTokensWithSymbolsToAllChain(['USDC', 'tUSDC', 'USDT', 'tUSDT', 'DAI', 'BUSD', 'tBUSD']);

// ADD NETWORK
export const ROBO: { [chainId: number]: Token } = {
  ...mapTokensWithSymbolToAllChain('RBIF'),
};

export const USDC_MAINNET = USDC[SupportedChainId.MAINNET];
export const USDT_MAINNET = USDT[SupportedChainId.MAINNET];

type DefaultCurrencyValue = {
  [chain in SupportedChainId]: string;
};
export const DEFAULT_INPUT_CURRENCY: DefaultCurrencyValue = {
  ...Object.values(NATIVE_TOKEN).reduce((state, token) => {
    state[token.chainId] = token.symbol;
    return state;
  }, {} as DefaultCurrencyValue),
};

export const DEFAULT_OUTPUT_CURRENCY: DefaultCurrencyValue = {
  ...Object.values(ROBO).reduce((state, token) => {
    state[token.chainId] = token.address;
    return state;
  }, {} as DefaultCurrencyValue),

  [SupportedChainId.BSC as any]: BUSD[SupportedChainId.BSC].address,
};

export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] };
} = {};

export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] };
} = {};

// ADD NETWORK
export const BASE_USD_TOKEN: {
  [chainId: number]: Token;
} = {
  [SupportedChainId.MAINNET]: USDC_MAINNET,
  [SupportedChainId.SEPOLIA]: USDC[SupportedChainId.SEPOLIA],

  [SupportedChainId.POLYGON]: USDC[SupportedChainId.POLYGON],
  [SupportedChainId.POLYGON_MUMBAI]: USDC[SupportedChainId.POLYGON_MUMBAI],

  [SupportedChainId.BSC]: USDC[SupportedChainId.BSC],
  [SupportedChainId.BSC_TESTNET]: USDC[SupportedChainId.BSC_TESTNET],
};

// ADD NETWORK
export const STABLECOIN_AMOUNT_OUT: {
  [chainId: number]: CurrencyAmount<Token>;
} = {
  [SupportedChainId.MAINNET]: CurrencyAmount.fromRawAmount(
    BASE_USD_TOKEN[SupportedChainId.MAINNET],
    getFullDecimals(100000, BASE_USD_TOKEN[SupportedChainId.MAINNET].decimals).toNumber(),
  ),
  [SupportedChainId.SEPOLIA]: CurrencyAmount.fromRawAmount(
    BASE_USD_TOKEN[SupportedChainId.SEPOLIA],
    getFullDecimals(100000, BASE_USD_TOKEN[SupportedChainId.SEPOLIA].decimals).toNumber(),
  ),
  [SupportedChainId.POLYGON]: CurrencyAmount.fromRawAmount(
    BASE_USD_TOKEN[SupportedChainId.POLYGON],
    getFullDecimals(100000, BASE_USD_TOKEN[SupportedChainId.POLYGON].decimals).toNumber(),
  ),
  [SupportedChainId.POLYGON_MUMBAI]: CurrencyAmount.fromRawAmount(
    BASE_USD_TOKEN[SupportedChainId.POLYGON_MUMBAI],
    getFullDecimals(100000, BASE_USD_TOKEN[SupportedChainId.POLYGON_MUMBAI].decimals).toNumber(),
  ),
  [SupportedChainId.BSC]: CurrencyAmount.fromRawAmount(
    BASE_USD_TOKEN[SupportedChainId.BSC],
    getFullDecimals(100000, BASE_USD_TOKEN[SupportedChainId.BSC].decimals).toNumber(),
  ),
  [SupportedChainId.BSC_TESTNET]: CurrencyAmount.fromRawAmount(
    BASE_USD_TOKEN[SupportedChainId.BSC_TESTNET],
    getFullDecimals(100000, BASE_USD_TOKEN[SupportedChainId.BSC_TESTNET].decimals).toNumber(),
  ),
};

const WRAPPED_NATIVE_CURRENCIES_ONLY = Object.fromEntries(
  Object.entries(WRAPPED_NATIVE_CURRENCY)
    .map(([key, value]) => [key, [value]])
    .filter(Boolean),
);

// ADD NETWORK
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_CURRENCIES_ONLY,
  [SupportedChainId.MAINNET]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.MAINNET],
    USDT[SupportedChainId.MAINNET],
    USDC[SupportedChainId.MAINNET],
  ],

  [SupportedChainId.SEPOLIA]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.SEPOLIA],
    USDT[SupportedChainId.SEPOLIA],
    USDC[SupportedChainId.SEPOLIA],
  ],

  [SupportedChainId.POLYGON]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.POLYGON],
    USDT[SupportedChainId.POLYGON],
    USDC[SupportedChainId.POLYGON],
  ],

  [SupportedChainId.POLYGON_MUMBAI]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.POLYGON_MUMBAI],
    USDT[SupportedChainId.POLYGON_MUMBAI],
    USDC[SupportedChainId.POLYGON_MUMBAI],
  ],

  [SupportedChainId.BSC]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.BSC],
    USDT[SupportedChainId.BSC],
    USDC[SupportedChainId.BSC],
  ],
  [SupportedChainId.BSC_TESTNET]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.BSC_TESTNET],
    USDT[SupportedChainId.BSC_TESTNET],
    USDC[SupportedChainId.BSC_TESTNET],
  ],
};

export const TOKEN_SHORTHANDS: {
  [shorthand: string]: { [chainId in SupportedChainId]?: string };
} = {
  USDC: Object.keys(USDC).reduce((state, key) => {
    state[key] = USDC[key].address;
    return state;
  }, {}),
    tUSDT: Object.keys(USDT).reduce((state, key) => {
        state[key] = USDT[key].address;
        return state;
    }, {}),
    DAI: Object.keys(DAI).reduce((state, key) => {
        state[key] = DAI[key].address;
        return state;
    }, {}),
    SHIB: Object.keys(SHIB).reduce((state, key) => {
        state[key] = SHIB[key].address;
        return state;
    }, {}),
    BUSD: Object.keys(BUSD).reduce((state, key) => {
        state[key] = BUSD[key].address;
        return state;
    }, {}),
    RBIF: Object.keys(ROBO).reduce((state, key) => {
        state[key] = ROBO[key].address;
        return state;
    }, {}),
};

export const TOKENS_BY_ADDRESS_MAP = {
    [SupportedChainId.MAINNET]: {
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': new Token(SupportedChainId.MAINNET, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 18, 'WETH', 'Wrapped Ether'),
        '0x0e6fa9c050c8a707e7f56a2b3695665e4f9eac9b': new Token(SupportedChainId.MAINNET, '0x0e6fa9c050c8a707e7f56a2b3695665e4f9eac9b', 9, 'RBIF', 'ROBO INU'),
        '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce': new Token(SupportedChainId.MAINNET, '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', 18, 'SHIB', 'SHIBA INU'),
        '0xdac17f958d2ee523a2206206994597c13d831ec7': new Token(SupportedChainId.MAINNET, '0xdac17f958d2ee523a2206206994597c13d831ec7', 6, 'USDT', 'Tether USD'),
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': new Token(SupportedChainId.MAINNET, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6, 'USDC', 'USD Coin'),
        '0x6b175474e89094c44da98b954eedeac495271d0f': new Token(SupportedChainId.MAINNET, '0x6b175474e89094c44da98b954eedeac495271d0f', 18, 'DAI', 'Dai Stablecoin'),
        '0x4fabb145d64652a948d72533023f6e7a623c7c53': new Token(SupportedChainId.MAINNET, '0x4fabb145d64652a948d72533023f6e7a623c7c53', 18, 'BUSD', 'Binance USD'),
    },
    [SupportedChainId.SEPOLIA]: {
        '0x139d5337dee3f1e3ba77368660715ebe9b1c3b03': new Token(SupportedChainId.SEPOLIA, '0x139d5337dee3f1e3ba77368660715ebe9b1c3b03', 18, 'WETH', 'Wrapped Ether'),
        '0x41ddf33aad71b9aa1354848bfd6bc687e2c6ab42': new Token(SupportedChainId.SEPOLIA, '0x41ddf33aad71b9aa1354848bfd6bc687e2c6ab42', 18, 'FLOWER', 'Flower'),
        '0x6d9a266c281fdbf1e1917f784f3febe74e03b2da': new Token(SupportedChainId.SEPOLIA, '0x6d9a266c281fdbf1e1917f784f3febe74e03b2da', 18, 'SHIB', 'SHIBA INU'),
        '0x135e7fee9d57d28e2cf126fd969dcc16ca5c439c': new Token(SupportedChainId.SEPOLIA, '0x135e7fee9d57d28e2cf126fd969dcc16ca5c439c', 9, 'RBIF', 'ROBO INU'),
        '0x51feeed7f999b1a56875253cbfc4542687bde3b3': new Token(SupportedChainId.SEPOLIA, '0x51feeed7f999b1a56875253cbfc4542687bde3b3', 6, 'tUSDT', 'Tether USD'),
        '0xae5a9f2f7b453eed7d0df7c0ff79b68166629031': new Token(SupportedChainId.SEPOLIA, '0xae5a9f2f7b453eed7d0df7c0ff79b68166629031', 6, 'USDC', 'USD Coin'),
        '0x9a6b878dcf8929e13e69c63d471e02f954953cc8': new Token(SupportedChainId.SEPOLIA, '0x9a6b878dcf8929e13e69c63d471e02f954953cc8', 18, 'DAI', 'Dai Stablecoin')
    },
    [SupportedChainId.POLYGON]: {
        '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': new Token(SupportedChainId.POLYGON, '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 18, 'WMATIC', 'Wrapped Matic'),
        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f': new Token(SupportedChainId.POLYGON, '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', 6, 'USDT', 'Tether USD (PoS)'),
        '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063': new Token(SupportedChainId.POLYGON, '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', 18, 'DAI', 'Dai Stablecoin (PoS)'),
        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': new Token(SupportedChainId.POLYGON, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', 6, 'USDC', 'USD Coin (PoS)'),
    },
    [SupportedChainId.BSC]: {
        '0xe9e7cea3dedca5984780bafc599bd69add087d56': new Token(SupportedChainId.BSC, '0xe9e7cea3dedca5984780bafc599bd69add087d56', 18, 'BUSD', 'Binance USD'),
        '0x55d398326f99059ff775485246999027b3197955': new Token(SupportedChainId.BSC, '0x55d398326f99059ff775485246999027b3197955', 18, 'USDT', 'Tether USD'),
        '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': new Token(SupportedChainId.BSC, '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', 18, 'USDC', 'USD Coin'),
        '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3': new Token(SupportedChainId.BSC, '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', 18, 'DAI', 'Dai Stablecoin'),
    },
};
