import { getClient } from '@wagmi/core';

import { networks } from 'config/networks';
import { ROBOEX_PAIR_SYMBOL } from 'config/pair';
import { BAD_SRCS } from 'config/tokens';

/**
 * Prompt the user to add a custom token to metamask
 * @param address
 * @param symbol
 * @param address
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async ({
  address,
  symbol,
  decimals,
  logo,
}: {
  address: string;
  symbol: string;
  decimals: number;
  logo?: string;
}) => {
  // better leave this undefined for default image instead of broken image url
  const image = logo ? (BAD_SRCS[logo] ? undefined : logo) : symbol === ROBOEX_PAIR_SYMBOL ? undefined : logo;

  const tokenAdded = await getClient().connector.watchAsset({
    address,
    symbol,
    decimals: parseInt(decimals.toString(), 10),
    image,
  });

  return tokenAdded;
};

export const CHAIN_IDS = Object.values(networks).map((c) => c.chainId);

// export const isChainTestnet = memoize(
//   (chainId: number) => Object.values(networks).find((c) => c.chainId === chainId)?
// );
