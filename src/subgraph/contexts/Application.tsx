import dayjs from 'dayjs';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { client, healthClient } from 'subgraph/apollo/client';
import { ETH_PRICE, SUBGRAPH_HEALTH } from 'subgraph/apollo/queries';
import { getBlockFromTimestamp, getPercentChange } from './utils';

const UPDATE_LATEST_BLOCK = 'UPDATE_LATEST_BLOCK';
const UPDATE_HEAD_BLOCK = 'UPDATE_HEAD_BLOCK';

const LATEST_BLOCK = 'LATEST_BLOCK';
const HEAD_BLOCK = 'HEAD_BLOCK';
const UPDATE_ETH_PRICE = 'UPDATE_ETH_PRICE';
const ETH_PRICE_KEY = 'ETH_PRICE_KEY';

const ApplicationContext = createContext<
  [
    any,
    {
      updateLatestBlock: (block: number) => void;
      updateHeadBlock: (block: number) => void;
      updateEthPrice: (ethPrice: number, oneDayPrice: number, ethPriceChange: number) => void;
    },
  ]
>([
  null,
  {
    updateLatestBlock: () => {},
    updateHeadBlock: () => {},
    updateEthPrice: () => {},
  },
]);

function useApplicationContext() {
  return useContext(ApplicationContext);
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_ETH_PRICE: {
      const { ethPrice, oneDayPrice, ethPriceChange } = payload;
      return {
        [ETH_PRICE_KEY]: ethPrice,
        oneDayPrice,
        ethPriceChange,
      };
    }

    case UPDATE_LATEST_BLOCK: {
      const { block } = payload;
      return {
        ...state,
        [LATEST_BLOCK]: block,
      };
    }

    case UPDATE_HEAD_BLOCK: {
      const { block } = payload;
      return {
        ...state,
        [HEAD_BLOCK]: block,
      };
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`);
    }
  }
}

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});

  const updateEthPrice = useCallback((ethPrice, oneDayPrice, ethPriceChange) => {
    dispatch({
      type: UPDATE_ETH_PRICE,
      payload: {
        ethPrice,
        oneDayPrice,
        ethPriceChange,
      },
    });
  }, []);

  const updateLatestBlock = useCallback((block) => {
    dispatch({
      type: UPDATE_LATEST_BLOCK,
      payload: {
        block,
      },
    });
  }, []);

  const updateHeadBlock = useCallback((block) => {
    dispatch({
      type: UPDATE_HEAD_BLOCK,
      payload: {
        block,
      },
    });
  }, []);

  return (
    <ApplicationContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updateLatestBlock,
            updateHeadBlock,
            updateEthPrice,
          },
        ],
        [state, updateEthPrice, updateLatestBlock, updateHeadBlock],
      )}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
export default Provider;

export function useLatestBlocks() {
  const [state, { updateLatestBlock, updateHeadBlock }] = useApplicationContext();

  const latestBlock = state?.[LATEST_BLOCK];
  const headBlock = state?.[HEAD_BLOCK];

  useEffect(() => {
    async function fetch() {
      healthClient
        .query({
          query: SUBGRAPH_HEALTH,
        })
        .then((res) => {
          if (res.data.indexingStatusForCurrentVersion?.chains) {
            const syncedBlock = res.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number;
            const headBlock = res.data.indexingStatusForCurrentVersion.chains[0].chainHeadBlock.number;
            if (syncedBlock && headBlock) {
              updateLatestBlock(syncedBlock);
              updateHeadBlock(headBlock);
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (!latestBlock) {
      fetch();
    }
  }, [latestBlock, updateHeadBlock, updateLatestBlock]);

  return [latestBlock, headBlock];
}

export const getEthPrice = async () => {
  const utcCurrentTime = dayjs();
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').startOf('minute').unix();

  let ethPrice = 0;
  let ethPriceOneDay = 0;
  let priceChangeETH = 0;

  try {
    const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack);
    const result = await client.query({
      query: ETH_PRICE(null),
      fetchPolicy: 'cache-first',
    });
    const resultOneDay = await client.query({
      query: ETH_PRICE(oneDayBlock),
      fetchPolicy: 'cache-first',
    });
    const currentPrice = result?.data?.bundles[0]?.ethPrice;
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.ethPrice;
    priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice);
    ethPrice = currentPrice;
    ethPriceOneDay = oneDayBackPrice;
  } catch (e) {
    console.log(e);
  }

  return [ethPrice, ethPriceOneDay, priceChangeETH];
};

export function useEthPrice() {
  const [state, { updateEthPrice }] = useApplicationContext();
  const ethPrice = state?.[ETH_PRICE_KEY];
  const ethPriceOld = state?.oneDayPrice;
  useEffect(() => {
    async function checkForEthPrice() {
      if (!ethPrice) {
        const [newPrice, oneDayPrice, priceChange] = await getEthPrice();
        updateEthPrice(newPrice, oneDayPrice, priceChange);
      }
    }
    checkForEthPrice();
  }, [ethPrice, updateEthPrice]);

  return [ethPrice, ethPriceOld];
}
