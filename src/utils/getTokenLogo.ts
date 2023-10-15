/* eslint-disable max-len */
import { isSupportedChain } from 'config/constants/chains';
import { SupportedChainId } from 'config/sdk-core';
import { DEFAULT_TOKEN_LIST } from 'config/lists';

// ADD NETWORK
const mapping = {
  [SupportedChainId.BSC]: 'smartchain',
  [SupportedChainId.BSC_TESTNET]: 'smartchain',
  [SupportedChainId.POLYGON]: 'smartchain',
  [SupportedChainId.POLYGON_MUMBAI]: 'smartchain',
  [SupportedChainId.MAINNET]: 'ethereum',
  [SupportedChainId.SEPOLIA]: 'ethereum',
};

export function getTokenLogoURI(
  address: string,
  chainId: SupportedChainId = SupportedChainId.MAINNET,
  from: 'trustwallet' | 'uniswap' = 'uniswap',
): string {
  const currentChain = mapping[chainId];

  const findLogoDefault = DEFAULT_TOKEN_LIST.tokens.find(
    (token) => token.address.toLowerCase() === address?.toLowerCase() && token.chainId === chainId,
  );

  if (findLogoDefault?.logoURI) {
    return findLogoDefault.logoURI;
  }
  if (address && currentChain && from === 'trustwallet') {
    return `https://assets-cdn.trustwallet.com/blockchains/${currentChain}/assets/${address}/logo.png`;
  }
  const networksWithUrls = [SupportedChainId.MAINNET, SupportedChainId.SEPOLIA]; // ADD NETWORK
  if (networksWithUrls.includes(chainId)) {
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${currentChain}/assets/${address}/logo.png`;
  }
  return '';

  // Celo logo logo is hosted elsewhere.
  // if (isCelo(chainId)) {
  //   if (address === nativeOnChain(chainId).wrapped.address) {
  //     return 'https://raw.githubusercontent.com/ubeswap/default-token-list/master/assets/asset_CELO.png'
  //   }
  // }
}

export function getNativeLogoURI(chainId: SupportedChainId = SupportedChainId.MAINNET): string {
  const isSupport = isSupportedChain(chainId);
  switch (chainId) {
    // ADD NETWORK
    // case SupportedChainId.POLYGON:
    // case SupportedChainId.POLYGON_MUMBAI:
    //   return MaticLogo;
    // case SupportedChainId.CELO:
    // case SupportedChainId.CELO_ALFAJORES:
    //   return CeloLogo
    default:
      return isSupport && `/assets/images/chains/${chainId}.png`;
  }
}
