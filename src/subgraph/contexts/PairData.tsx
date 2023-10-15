/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-return-assign */
import dayjs from 'dayjs';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { LiveDataTimeframeEnum } from 'hooks/useBasicChartData';
import { isAddress } from 'utils/addressHelpers';
import { client } from '../apollo/client';
import { HOURLY_PAIR_RATES, PAIRS_BULK, PAIRS_HISTORICAL_BULK, PAIR_DATA } from '../apollo/queries';
import {
  get2DayPercentChange,
  getBlocksFromTimestamps,
  getPercentChange,
  getTimeStep,
  getTimeframe,
  getTimestampsForChanges,
  splitQuery,
} from './utils';
import { useEthPrice, useLatestBlocks } from './Application';

const UPDATE_HOURLY_DATA = 'UPDATE_HOURLY_DATA';
const UPDATE = 'UPDATE';

interface PairDataContextType {
  update: (pairAddress: string, data: any) => void;
  updateHourlyData: (address: string, hourlyData: any, timeWindow: any) => void;
}

const PairDataContext = createContext<[any, PairDataContextType]>([
  {},
  {
    update: () => {},
    updateHourlyData: () => {},
  },
]);

function usePairDataContext(): [any, PairDataContextType] {
  return useContext(PairDataContext);
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { pairAddress, data } = payload;
      return {
        ...state,
        [pairAddress]: {
          ...state?.[pairAddress],
          ...data,
        },
      };
    }

    case UPDATE_HOURLY_DATA: {
      const { address, hourlyData, timeWindow } = payload;
      return {
        ...state,
        [address]: {
          ...state?.[address],
          hourlyData: {
            ...state?.[address]?.hourlyData,
            [timeWindow]: hourlyData,
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

  // update pair specific data
  const update = useCallback((pairAddress, data) => {
    dispatch({
      type: UPDATE,
      payload: {
        pairAddress,
        data,
      },
    });
  }, []);

  const updateHourlyData = useCallback((address, hourlyData, timeWindow) => {
    dispatch({
      type: UPDATE_HOURLY_DATA,
      payload: { address, hourlyData, timeWindow },
    });
  }, []);

  return (
    <PairDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            updateHourlyData,
            update,
          },
        ],
        [state, updateHourlyData, update],
      )}
    >
      {children}
    </PairDataContext.Provider>
  );
};

export default Provider;

export function useHourlyRateData(pairAddress: string, timeWindow: LiveDataTimeframeEnum) {
  const [state, { updateHourlyData }] = usePairDataContext();
  const chartData = useMemo(() => state?.[pairAddress]?.hourlyData?.[timeWindow], [pairAddress, state, timeWindow]);
  const [latestBlock] = useLatestBlocks();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const data = await getHourlyRateData(pairAddress, timeWindow, latestBlock);
      updateHourlyData(pairAddress, data, timeWindow);
      setLoading(false);
    }
    if (!chartData) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, timeWindow, pairAddress, latestBlock, updateHourlyData]);

  return [loading, chartData];
}

const getHourlyRateData = async (pairAddress: string, timeWindow: LiveDataTimeframeEnum, latestBlock: string) => {
  try {
    const startTime = getTimeframe(timeWindow);
    const utcEndTime = dayjs.utc();
    let time = startTime;

    // create an array of hour start times until we reach current hour
    const timestamps = [];
    while (time <= utcEndTime.unix() - 3600) {
      timestamps.push(time);
      time += getTimeStep(timeWindow);
    }
    // backout if invalid timestamp format
    if (timestamps.length === 0) {
      return [];
    }
    // once you have all the timestamps, get the blocks for each timestamp in a bulk query
    let blocks;

    blocks = await getBlocksFromTimestamps(timestamps, 100);

    // catch failing case
    if (!blocks || blocks?.length === 0) {
      return [];
    }

    if (latestBlock) {
      blocks = blocks.filter((b) => {
        return parseFloat(b.number) <= parseFloat(latestBlock);
      });
    }

    const result = await splitQuery(HOURLY_PAIR_RATES, client, [pairAddress], blocks, 100);

    // format token ETH price results
    const values = [];
    for (const row in result) {
      const timestamp = row.split('t')[1];
      if (timestamp) {
        values.push({
          timestamp,
          rate0: parseFloat(result[row]?.token0Price),
          rate1: parseFloat(result[row]?.token1Price),

          token0: result[row]?.token0,
          token1: result[row]?.token1,
        });
      }
    }

    const formattedHistoryRate0 = [];
    const formattedHistoryRate1 = [];

    // for each hour, construct the open and close price
    for (let i = 0; i < values.length - 1; i++) {
      formattedHistoryRate0.push({
        timestamp: values[i].timestamp,
        open: parseFloat(values[i].rate0),
        close: parseFloat(values[i + 1].rate0),

        token0: values[i]?.token0,
        token1: values[i]?.token1,
      });
      formattedHistoryRate1.push({
        timestamp: values[i].timestamp,
        open: parseFloat(values[i].rate1),
        close: parseFloat(values[i + 1].rate1),

        token0: values[i]?.token0,
        token1: values[i]?.token1,
      });
    }

    return [values];
  } catch (e) {
    console.log(e);
    return [[], []];
  }
};

/**
 * Get all the current and 24hr changes for a pair
 */
export function usePairData(pairAddress: string) {
  const [state, { update }] = usePairDataContext();
  const [ethPrice] = useEthPrice();
  const pairData = state?.[pairAddress];

  useEffect(() => {
    async function fetchData() {
      if (!pairData && pairAddress) {
        const data = await getBulkPairData([pairAddress], ethPrice);
        if (data) update(pairAddress, data[0]);
      }
    }
    if (!pairData && pairAddress && ethPrice && isAddress(pairAddress)) {
      fetchData();
    }
  }, [pairAddress, pairData, update, ethPrice]);

  return pairData || {};
}

function parseData(data, oneDayData, twoDayData, oneWeekData, ethPrice, oneDayBlock) {
  const pairAddress = data.id;

  // get volume changes
  const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
    data?.volumeUSD,
    oneDayData?.volumeUSD ? oneDayData.volumeUSD : 0,
    twoDayData?.volumeUSD ? twoDayData.volumeUSD : 0,
  );
  const [oneDayVolumeUntracked, volumeChangeUntracked] = get2DayPercentChange(
    data?.untrackedVolumeUSD,
    oneDayData?.untrackedVolumeUSD ? parseFloat(oneDayData?.untrackedVolumeUSD) : 0,
    twoDayData?.untrackedVolumeUSD ? twoDayData?.untrackedVolumeUSD : 0,
  );

  const oneWeekVolumeUSD = parseFloat(oneWeekData ? data?.volumeUSD - oneWeekData?.volumeUSD : data.volumeUSD);

  const oneWeekVolumeUntracked = parseFloat(
    oneWeekData ? data?.untrackedVolumeUSD - oneWeekData?.untrackedVolumeUSD : data.untrackedVolumeUSD,
  );

  // set volume properties
  data.oneDayVolumeUSD = parseFloat(oneDayVolumeUSD.toString());
  data.oneWeekVolumeUSD = oneWeekVolumeUSD;
  data.volumeChangeUSD = volumeChangeUSD;
  data.oneDayVolumeUntracked = oneDayVolumeUntracked;
  data.oneWeekVolumeUntracked = oneWeekVolumeUntracked;
  data.volumeChangeUntracked = volumeChangeUntracked;

  // set liquidity properties
  data.trackedReserveUSD = data.trackedReserveETH * ethPrice;
  data.liquidityChangeUSD = getPercentChange(data.reserveUSD, oneDayData?.reserveUSD);

  // format if pair hasnt existed for a day or a week
  if (!oneDayData && data && data.createdAtBlockNumber > oneDayBlock) {
    data.oneDayVolumeUSD = parseFloat(data.volumeUSD);
  }
  if (!oneDayData && data) {
    data.oneDayVolumeUSD = parseFloat(data.volumeUSD);
  }
  if (!oneWeekData && data) {
    data.oneWeekVolumeUSD = parseFloat(data.volumeUSD);
  }

  // if (
  //   TRACKED_OVERRIDES_PAIRS.includes(pairAddress) ||
  //   TRACKED_OVERRIDES_TOKENS.includes(data.token0.id) ||
  //   TRACKED_OVERRIDES_TOKENS.includes(data.token1.id)
  // ) {
  //   data.oneDayVolumeUSD = oneDayVolumeUntracked;
  //   data.oneWeekVolumeUSD = oneWeekVolumeUntracked;
  //   data.volumeChangeUSD = volumeChangeUntracked;
  //   data.trackedReserveUSD = data.reserveUSD;
  // }

  return data;
}

async function getBulkPairData(pairList, ethPrice) {
  const [t1, t2, tWeek] = getTimestampsForChanges();
  const [{ number: b1 }, { number: b2 }, { number: bWeek }] = await getBlocksFromTimestamps([t1, t2, tWeek]);

  try {
    const current = await client.query({
      query: PAIRS_BULK,
      variables: {
        allPairs: pairList,
      },
      fetchPolicy: 'cache-first',
    });

    const [oneDayResult, twoDayResult, oneWeekResult] = await Promise.all(
      [b1, b2, bWeek].map(async (block) => {
        const result = client.query({
          query: PAIRS_HISTORICAL_BULK(block, pairList),
          fetchPolicy: 'cache-first',
        });
        return result;
      }),
    );

    const oneDayData = oneDayResult?.data?.pairs.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur };
    }, {});

    const twoDayData = twoDayResult?.data?.pairs.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur };
    }, {});

    const oneWeekData = oneWeekResult?.data?.pairs.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur };
    }, {});

    const pairData = await Promise.all(
      current &&
        current.data.pairs.map(async (pair) => {
          let data = pair;
          let oneDayHistory = oneDayData?.[pair.id];
          if (!oneDayHistory) {
            const newData = await client.query({
              query: PAIR_DATA(pair.id, b1),
              fetchPolicy: 'cache-first',
            });
            oneDayHistory = newData.data.pairs[0];
          }
          let twoDayHistory = twoDayData?.[pair.id];
          if (!twoDayHistory) {
            const newData = await client.query({
              query: PAIR_DATA(pair.id, b2),
              fetchPolicy: 'cache-first',
            });
            twoDayHistory = newData.data.pairs[0];
          }
          let oneWeekHistory = oneWeekData?.[pair.id];
          if (!oneWeekHistory) {
            const newData = await client.query({
              query: PAIR_DATA(pair.id, bWeek),
              fetchPolicy: 'cache-first',
            });
            oneWeekHistory = newData.data.pairs[0];
          }
          data = parseData(data, oneDayHistory, twoDayHistory, oneWeekHistory, ethPrice, b1);
          return data;
        }),
    );
    return pairData;
  } catch (e) {
    console.log(e);
  }
}
