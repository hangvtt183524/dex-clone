/* eslint-disable max-len */
import { constructSameAddressMap } from 'config/constants/chains';
import { SupportedChainId } from 'config/sdk-core';

// UPDATE MAINNET
const V3_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
const V2_FACTORY_ADDRESS = '0xd6fDDDc9A79AA8215aEA6CA790D87406dba5CDf3'; // '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const V2_ROUTER_ADDRESS = '0xcd02928F3194b0e52b2FeA56ee78F3eBf0bb016c'; // '0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
const V3_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
const QUOTER_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'; // use for swap v3

export const BAD_RECIPIENT_ADDRESSES: { [address: string]: true } = {
  [V2_FACTORY_ADDRESS]: true, // v2 factory
  [V2_ROUTER_ADDRESS]: true, // v2 router 02
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a': true, // v2 router 01
};

// ADD NETWORK
const uniswap = {
  factoryV2Uniswap: {
    ...constructSameAddressMap('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', []),
  },
  factoryV2: {
    ...constructSameAddressMap(V2_FACTORY_ADDRESS, [
      SupportedChainId.POLYGON_MUMBAI,
      SupportedChainId.BSC,
      SupportedChainId.BSC_TESTNET,
    ]),
    [SupportedChainId.POLYGON]: '0x02D33064eCB180Ef8d79Ac38B98B03B63e5d41d6',
    [SupportedChainId.POLYGON_MUMBAI]: '0x5757371414417b8c6caad45baef941abc7d3ab32',

    [SupportedChainId.SEPOLIA]: '0x832d4b9FDCA27541781D73757d25c572171b2067',
  },
  routerV2Uniswap: {
    ...constructSameAddressMap('0x7a250d5630b4cf539739df2c5dacb4c659f2488d', []),
  },
  routerV2: {
    ...constructSameAddressMap(V2_ROUTER_ADDRESS, [
      SupportedChainId.BSC,
      SupportedChainId.BSC_TESTNET,
    ]),
    [SupportedChainId.POLYGON]: '0xa9334f0E3b917f62F90a9C1d0780DD9A0b5dF40E',
    [SupportedChainId.POLYGON_MUMBAI]: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',

    [SupportedChainId.SEPOLIA]: '0x17af32FcF800183D04e441CC792B3ea79eA51554',
  },

  routerV3: {
    ...constructSameAddressMap(V3_ROUTER_ADDRESS, [
      SupportedChainId.POLYGON,
      SupportedChainId.BSC,
      SupportedChainId.BSC_TESTNET,
    ]),
  },
  factoryV3: {
    ...constructSameAddressMap(V3_FACTORY_ADDRESS, [
      SupportedChainId.POLYGON,
      SupportedChainId.POLYGON_MUMBAI,
      SupportedChainId.BSC,
      SupportedChainId.BSC_TESTNET,
    ]),
  },
  quoter: {
    ...constructSameAddressMap(QUOTER_ADDRESS, []),
  },

  multicall2: {
    // ADD NETWORK
    [SupportedChainId.MAINNET]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    [SupportedChainId.SEPOLIA]: '0x7a37FcaBaCC6b04422f2A625080cEf2D1B4B6E4e',

    [SupportedChainId.BSC]: '0xff6fd90a470aaa0c1b8a54681746b07acdfedc9b',
    [SupportedChainId.BSC_TESTNET]: '0xA94CAf066dA2c90708603FbA4fa14948db5e810c',

    [SupportedChainId.POLYGON]: '0x275617327c958bD06b5D6b871E7f491D76113dd8',
    [SupportedChainId.POLYGON_MUMBAI]: '0xe9939e7Ea7D7fb619Ac57f648Da7B1D425832631',
  },
};

// ADD NETWORK
const contractAddress = {
  ...uniswap,
};
export default contractAddress;
