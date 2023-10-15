/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-unsafe-optional-chaining */
import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { isAddress } from 'utils/addressHelpers';
import { client } from '../apollo/client';
import { PRICES_BY_BLOCK, TOKEN_DATA } from '../apollo/queries';

import {
  get2DayPercentChange,
  getPercentChange,
  getBlockFromTimestamp,
  getBlocksFromTimestamps,
  splitQuery,
  getTimeframe,
  getTimeStep,
} from './utils';
import { useEthPrice, useLatestBlocks } from './Application';

const UPDATE = 'UPDATE';
const UPDATE_PRICE_DATA = 'UPDATE_PRICE_DATA';

const TokenDataContext = createContext<
  [
    any,
    {
      update: (tokenAddress: string, data: any) => void;
      updatePriceData: (tokenAddress: string, data: any, time: any, inverval: any) => void;
    },
  ]
>([
  {},
  {
    update: () => {},
    updatePriceData: () => {},
  },
]);

export function useTokenDataContext() {
  return useContext(TokenDataContext);
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { tokenAddress, data } = payload;
      return {
        ...state,
        [tokenAddress]: {
          ...state?.[tokenAddress],
          ...data,
        },
      };
    }

    case UPDATE_PRICE_DATA: {
      const { address, data, timeWindow, interval } = payload;
      return {
        ...state,
        [address]: {
          ...state?.[address],
          [timeWindow]: {
            ...state?.[address]?.[timeWindow],
            [interval]: data,
          },
        },
      };
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`);
    }
  }
}

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});
  const update = useCallback((tokenAddress, data) => {
    dispatch({
      type: UPDATE,
      payload: {
        tokenAddress,
        data,
      },
    });
  }, []);

  const updatePriceData = useCallback((address, data, timeWindow, interval) => {
    dispatch({
      type: UPDATE_PRICE_DATA,
      payload: { address, data, timeWindow, interval },
    });
  }, []);

  return (
    <TokenDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updatePriceData,
          },
        ],
        [state, update, updatePriceData],
      )}
    >
      {children}
    </TokenDataContext.Provider>
  );
};

export default Provider;

const getTokenData = async (address, ethPrice, ethPriceOld) => {
  const utcCurrentTime = dayjs();
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').startOf('minute').unix();
  const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').startOf('minute').unix();
  const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack);
  const twoDayBlock = await getBlockFromTimestamp(utcTwoDaysBack);

  // initialize data arrays
  let data = {} as any;
  let oneDayData = {} as any;
  let twoDayData = {} as any;

  try {
    // fetch all current and historical data
    const result = await client.query({
      query: TOKEN_DATA(address, null),
      fetchPolicy: 'cache-first',
    });

    data = result?.data?.tokens?.[0] || {};
    // get results from 24 hours in past

    const oneDayResult = await client.query({
      query: TOKEN_DATA(address, oneDayBlock),
      fetchPolicy: 'cache-first',
    });
    oneDayData = oneDayResult.data.tokens[0];

    // get results from 48 hours in past
    const twoDayResult = await client.query({
      query: TOKEN_DATA(address, twoDayBlock),
      fetchPolicy: 'cache-first',
    });
    twoDayData = twoDayResult.data.tokens[0];

    // catch the case where token wasnt in top list in previous days
    if (!oneDayData) {
      const oneDayResult = await client.query({
        query: TOKEN_DATA(address, oneDayBlock),
        fetchPolicy: 'cache-first',
      });
      oneDayData = oneDayResult.data.tokens[0];
    }
    if (!twoDayData) {
      const twoDayResult = await client.query({
        query: TOKEN_DATA(address, twoDayBlock),
        fetchPolicy: 'cache-first',
      });
      twoDayData = twoDayResult.data.tokens[0];
    }

    // calculate percentage changes and daily changes
    const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
      data?.tradeVolumeUSD,
      oneDayData?.tradeVolumeUSD ?? 0,
      twoDayData?.tradeVolumeUSD ?? 0,
    );

    // calculate percentage changes and daily changes
    const [oneDayVolumeUT, volumeChangeUT] = get2DayPercentChange(
      data?.untrackedVolumeUSD,
      oneDayData?.untrackedVolumeUSD ?? 0,
      twoDayData?.untrackedVolumeUSD ?? 0,
    );

    // calculate percentage changes and daily changes
    const [oneDayTxns, txnChange] = get2DayPercentChange(
      data?.txCount,
      oneDayData?.txCount ?? 0,
      twoDayData?.txCount ?? 0,
    );

    const priceChangeUSD = getPercentChange(
      data?.derivedETH * ethPrice,
      parseFloat(oneDayData?.derivedETH ?? 0) * ethPriceOld,
    );

    const currentLiquidityUSD = data?.totalLiquidity * ethPrice * data?.derivedETH;
    const oldLiquidityUSD = oneDayData?.totalLiquidity * ethPriceOld * oneDayData?.derivedETH;

    // set data
    data.priceUSD = data?.derivedETH * ethPrice;
    data.totalLiquidityUSD = currentLiquidityUSD;
    data.oneDayVolumeUSD = oneDayVolumeUSD;
    data.volumeChangeUSD = volumeChangeUSD;
    data.priceChangeUSD = priceChangeUSD;
    data.oneDayVolumeUT = oneDayVolumeUT;
    data.volumeChangeUT = volumeChangeUT;
    const liquidityChangeUSD = getPercentChange(currentLiquidityUSD ?? 0, oldLiquidityUSD ?? 0);
    data.liquidityChangeUSD = liquidityChangeUSD;
    data.oneDayTxns = oneDayTxns;
    data.txnChange = txnChange;

    // used for custom adjustments
    data.oneDayData = oneDayData?.[address];
    data.twoDayData = twoDayData?.[address];

    // new tokens
    if (!oneDayData && data) {
      data.oneDayVolumeUSD = data.tradeVolumeUSD;
      data.oneDayVolumeETH = data.tradeVolume * data.derivedETH;
      data.oneDayTxns = data.txCount;
    }
    // eslint-disable-next-line no-empty
  } catch (e) {
    console.log(e);
  }
  return data;
};

const getIntervalTokenData = async (tokenAddress, timeWindow, interval = 3600, latestBlock) => {
  const utcEndTime = dayjs.utc();
  const startTime = getTimeframe(timeWindow);
  let time = startTime;
  // create an array of hour start times until we reach current hour
  // buffer by half hour to catch case where graph isnt synced to latest block
  const timestamps = [];
  while (time < utcEndTime.unix()) {
    timestamps.push(time);
    time += getTimeStep(timeWindow);
  }

  // backout if invalid timestamp format
  if (timestamps.length === 0) {
    return [];
  }

  // once you have all the timestamps, get the blocks for each timestamp in a bulk query
  let blocks;
  try {
    blocks = await getBlocksFromTimestamps(timestamps, 100);

    // catch failing case
    if (!blocks || blocks.length === 0) {
      return [];
    }

    if (latestBlock) {
      blocks = blocks.filter((b) => {
        return parseFloat(b.number) <= parseFloat(latestBlock);
      });
    }

    const result = await splitQuery(PRICES_BY_BLOCK, client, [tokenAddress], blocks, 50);

    // format token ETH price results
    const values = [];
    for (const row in result) {
      const timestamp = row.split('t')[1];
      const derivedETH = parseFloat(result[row]?.derivedETH);
      if (timestamp) {
        values.push({
          timestamp,
          derivedETH,
        });
      }
    }

    // go through eth usd prices and assign to original values array
    let index = 0;
    for (const brow in result) {
      const timestamp = brow.split('b')[1];
      if (timestamp) {
        values[index].priceUSD = result[brow].ethPrice * values[index].derivedETH;
        index += 1;
      }
    }

    const formattedHistory = [];

    // for each hour, construct the open and close price
    for (let i = 0; i < values.length - 1; i++) {
      formattedHistory.push({
        timestamp: values[i].timestamp,
        open: parseFloat(values[i].priceUSD),
        close: parseFloat(values[i + 1].priceUSD),
      });
    }

    return formattedHistory;
  } catch (e) {
    return [];
  }
};

export function useTokenData(tokenAddress) {
  const [state, { update }] = useTokenDataContext();
  const tokenData = useMemo(() => state?.[tokenAddress], [state, tokenAddress]);
  const [ethPrice, ethPriceOld] = useEthPrice();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokenData && ethPrice && ethPriceOld && isAddress(tokenAddress)) {
      setLoading(true);
      getTokenData(tokenAddress, ethPrice, ethPriceOld)
        .then((data) => {
          update(tokenAddress, data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [ethPrice, ethPriceOld, tokenAddress, tokenData, update]);

  useEffect(() => {
    return () => {
      client.clearStore();
    };
  }, []);

  return [loading, tokenData || {}];
}

/**
 * get candlestick data for a token - saves in context based on the window and the
 * interval size
 * @param {*} tokenAddress
 * @param {*} timeWindow // a preset time window from constant - how far back to look
 * @param {*} interval  // the chunk size in seconds - default is 1 hour of 3600s
 */
export function useTokenPriceData(tokenAddress, timeWindow, interval = 3600) {
  const [state, { updatePriceData }] = useTokenDataContext();
  const [loading, setLoading] = useState(false);

  const chartData = useMemo(
    () => state?.[tokenAddress]?.[timeWindow]?.[interval],
    [interval, state, timeWindow, tokenAddress],
  );

  const [latestBlock] = useLatestBlocks();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const data = await getIntervalTokenData(tokenAddress, timeWindow, interval, latestBlock);
      updatePriceData(tokenAddress, data, timeWindow, interval);
      setLoading(false);
    }
    if (!chartData && isAddress(tokenAddress)) {
      fetch();
    }
  }, [chartData, interval, timeWindow, tokenAddress, updatePriceData, latestBlock]);

  return [loading, chartData];
}
