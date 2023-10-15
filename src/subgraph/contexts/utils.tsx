/* eslint-disable camelcase */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
import { BigNumber } from 'bignumber.js';
import Text from 'components/Text';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _Decimal from 'decimal.js-light';
import Numeral from 'numeral';
import toFormat from 'toformat';
import React from 'react';
import { LiveDataTimeframeEnum } from 'hooks/useBasicChartData';
import { blockClient } from 'subgraph/apollo/client';
import { GET_BLOCK, GET_BLOCKS } from 'subgraph/apollo/queries';
import { isAddress } from 'utils/addressHelpers';

// format libraries
const Decimal = toFormat(_Decimal);
BigNumber.set({ EXPONENTIAL_AT: 50 });
dayjs.extend(utc);

export function getTimeframe(timeWindow: LiveDataTimeframeEnum) {
  const utcEndTime = dayjs.utc();
  // based on window, get starttime
  let utcStartTime;
  switch (timeWindow) {
    case LiveDataTimeframeEnum.DAY:
      utcStartTime = utcEndTime.subtract(1, 'day').unix();
      break;
    case LiveDataTimeframeEnum.WEEK:
      utcStartTime = utcEndTime.subtract(1, 'week').endOf('day').unix() - 1;
      break;
    case LiveDataTimeframeEnum.MONTH:
      utcStartTime = utcEndTime.subtract(1, 'month').endOf('day').unix() - 1;
      break;
    case LiveDataTimeframeEnum.YEAR:
      utcStartTime = utcEndTime.subtract(1, 'year').endOf('day').unix() - 1;
      break;
    default:
      utcStartTime = utcEndTime.subtract(1, 'year').startOf('year').unix() - 1;
      break;
  }
  return utcStartTime;
}

export function getTimeStep(timeWindow: LiveDataTimeframeEnum) {
  switch (timeWindow) {
    case LiveDataTimeframeEnum.DAY:
    case LiveDataTimeframeEnum.WEEK:
      return 3600;

    case LiveDataTimeframeEnum.MONTH:
      return 3600 * 24;

    default:
      return 3600 * 24;
  }
}

export function getPoolLink(token0Address, token1Address = null, remove = false) {
  if (!token1Address) {
    return `https://app.uniswap.org/#/${remove ? 'remove' : 'add'}/v2/${
      token0Address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 'ETH' : token0Address
    }/${'ETH'}`;
  }
  return `https://app.uniswap.org/#/${remove ? 'remove' : 'add'}/v2/${
    token0Address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 'ETH' : token0Address
  }/${token1Address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 'ETH' : token1Address}`;
}

export function getSwapLink(token0Address, token1Address = null) {
  if (!token1Address) {
    return `https://app.uniswap.org/#/swap?inputCurrency=${token0Address}`;
  }
  return `https://app.uniswap.org/#/swap?inputCurrency=${
    token0Address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 'ETH' : token0Address
  }&outputCurrency=${token1Address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 'ETH' : token1Address}`;
}

export function getMiningPoolLink(token0Address) {
  return `https://app.uniswap.org/#/uni/ETH/${token0Address}`;
}

export function getUniswapAppLink(linkVariable) {
  const baseUniswapUrl = 'https://app.uniswap.org/#/uni';
  if (!linkVariable) {
    return baseUniswapUrl;
  }

  return `${baseUniswapUrl}/ETH/${linkVariable}`;
}

export function localNumber(val) {
  return Numeral(val).format('0,0');
}

export const toNiceDate = (date) => {
  const x = dayjs.utc(dayjs.unix(date)).format('MMM DD');
  return x;
};

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address, chars = 4) {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}

export const toWeeklyDate = (date) => {
  const formatted = dayjs.utc(dayjs.unix(date)) as any;
  date = new Date(formatted);
  const day = new Date(formatted).getDay();
  const lessDays = day === 6 ? 0 : day + 1;
  const wkStart = new Date(new Date(date).setDate(date.getDate() - lessDays));
  const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
  return `${dayjs.utc(wkStart).format('MMM DD')} - ${dayjs.utc(wkEnd).format('MMM DD')}`;
};

export function getTimestampsForChanges() {
  const utcCurrentTime = dayjs();
  const t1 = utcCurrentTime.subtract(1, 'day').startOf('minute').unix();
  const t2 = utcCurrentTime.subtract(2, 'day').startOf('minute').unix();
  const tWeek = utcCurrentTime.subtract(1, 'week').startOf('minute').unix();
  return [t1, t2, tWeek];
}

export async function splitQuery(query, localClient, vars, list, skipCount = 100) {
  let fetchedData = {};
  let allFound = false;
  let skip = 0;

  while (!allFound) {
    let end = list.length;
    if (skip + skipCount < list.length) {
      end = skip + skipCount;
    }
    const sliced = list.slice(skip, end);
    const result = await localClient.query({
      query: query(...vars, sliced),
      fetchPolicy: 'cache-first',
    });
    fetchedData = {
      ...fetchedData,
      ...result.data,
    };
    if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
      allFound = true;
    } else {
      skip += skipCount;
    }
  }

  return fetchedData;
}

/**
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param {Int} timestamp in seconds
 */
export async function getBlockFromTimestamp(timestamp) {
  const result = await blockClient.query({
    query: GET_BLOCK,
    variables: {
      timestampFrom: timestamp,
      timestampTo: timestamp + 600,
    },
    fetchPolicy: 'cache-first',
  });
  return result?.data?.blocks?.[0]?.number;
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param {Array} timestamps
 */
export async function getBlocksFromTimestamps(timestamps, skipCount = 500) {
  if (timestamps?.length === 0) {
    return [];
  }

  const fetchedData = await splitQuery(GET_BLOCKS, blockClient, [], timestamps, skipCount);

  const blocks = [];
  if (fetchedData) {
    for (const t in fetchedData) {
      if (fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split('t')[1],
          number: fetchedData[t][0].number,
        });
      }
    }
  }
  return blocks;
}

export const toNiceDateYear = (date) => dayjs.utc(dayjs.unix(date)).format('MMMM DD, YYYY');

export const toK = (num) => {
  return Numeral(num).format('0.[00]a').replace(/[kmbt]/g, m => m.toUpperCase());
};

export const setThemeColor = (theme) => document.documentElement.style.setProperty('--c-token', theme || '#333333');

export const Big = (number) => new BigNumber(number);

export const formatTime = (unix) => {
  const now = dayjs();
  const timestamp = dayjs.unix(unix);

  const inSeconds = now.diff(timestamp, 'second');
  const inMinutes = now.diff(timestamp, 'minute');
  const inHours = now.diff(timestamp, 'hour');
  const inDays = now.diff(timestamp, 'day');

  if (inHours >= 24) {
    return `${inDays} ${inDays === 1 ? 'day' : 'days'} ago`;
  }
  if (inMinutes >= 60) {
    return `${inHours} ${inHours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (inSeconds >= 60) {
    return `${inMinutes} ${inMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  return `${inSeconds} ${inSeconds === 1 ? 'second' : 'seconds'} ago`;
};

export const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num, digits) => {
  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return formatter.format(num);
};

export const toSignificant = (number, significantDigits) => {
  Decimal.set({ precision: significantDigits + 1, rounding: Decimal.ROUND_UP });
  const updated = new Decimal(number).toSignificantDigits(significantDigits);
  return updated.toFormat(updated.decimalPlaces(), { groupSeparator: '' });
};

export const formattedNum = (number, usd = false, acceptNegatives = false) => {
  if (Number.isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0' : 0;
  }
  const num = parseFloat(number);

  if (num > 1000000) {
    return (usd ? '$' : '') + toK(num.toFixed(0));
  }

  if (num === 0) {
    if (usd) {
      return '$0';
    }
    return 0;
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001';
  }

  if (num > 1000) {
    return usd ? formatDollarAmount(num, 0) : Number(parseFloat(num.toString()).toFixed(0)).toLocaleString();
  }

  if (usd) {
    if (num < 0.1) {
      return formatDollarAmount(num, 4);
    }
    return formatDollarAmount(num, 2);
  }

  return Number(parseFloat(num.toString()).toFixed(4)).toString();
};

export function rawPercent(percentRaw) {
  const percent = parseFloat((percentRaw * 100).toString());
  if (!percent || percent === 0) {
    return '0%';
  }
  if (percent < 1 && percent > 0) {
    return '< 1%';
  }
  return `${percent.toFixed(0)}%`;
}

export function formattedPercent(percent: string) {
  const _percent = parseFloat(percent);
  if (!_percent || _percent === 0) {
    return (
      <Text fontSize={['12px !important']} fontWeight={500}>
        0%
      </Text>
    );
  }

  if (_percent < 0.0001 && _percent > 0) {
    return (
      <Text fontSize={['12px !important']} fontWeight={500} color="mark">
        {'< 0.0001%'}
      </Text>
    );
  }

  if (_percent < 0 && _percent > -0.0001) {
    return (
      <Text fontSize={['12px !important']} fontWeight={500} color="failure">
        {'< 0.0001%'}
      </Text>
    );
  }

  const fixedPercent = _percent.toFixed(2);
  if (fixedPercent === '0.00') {
    return '0%';
  }

  if (new BigNumber(fixedPercent).gt(0)) {
    if (new BigNumber(fixedPercent).gt(100)) {
      return (
        <Text fontSize={['12px !important']} fontWeight={500} color="mark">{`+${_percent
          ?.toFixed(0)
          .toLocaleString()}%`}</Text>
      );
    }
    return <Text fontSize={['12px !important']} fontWeight={500} color="mark">{`+${fixedPercent}%`}</Text>;
  }
  return <Text fontSize={['12px !important']} fontWeight={500} color="failure">{`${fixedPercent}%`}</Text>;
}

/**
 * gets the amoutn difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 * @param {*} value48HoursAgo
 */
export const get2DayPercentChange = (valueNow, value24HoursAgo, value48HoursAgo) => {
  // get volume info for both 24 hour periods
  const currentChange = parseFloat(valueNow) - parseFloat(value24HoursAgo);
  const previousChange = parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo);

  const adjustedPercentChange =
    (parseFloat((currentChange - previousChange).toString()) / parseFloat(previousChange.toString())) * 100;

  if (Number.isNaN(adjustedPercentChange) || !Number.isFinite(adjustedPercentChange)) {
    return [currentChange, 0];
  }
  return [currentChange, adjustedPercentChange];
};

/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 */
export const getPercentChange = (valueNow, value24HoursAgo) => {
  const adjustedPercentChange =
    ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) / parseFloat(value24HoursAgo)) * 100;
  if (Number.isNaN(adjustedPercentChange) || !Number.isFinite(adjustedPercentChange)) {
    return 0;
  }
  return adjustedPercentChange;
};

export function isEquivalent(a, b) {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) {
    return false;
  }
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}
interface BasicData {
  token0?: {
    id: string;
    name: string;
    symbol: string;
  };
  token1?: {
    id: string;
    name: string;
    symbol: string;
  };
}

// Override data return from graph - usually because proxy token has changed
// names since entitiy was created in subgraph
// keys are lowercase token addresses <--------
const TOKEN_OVERRIDES: { [address: string]: { name: string; symbol: string } } = {
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
    name: 'Ether (Wrapped)',
    symbol: 'ETH',
  },
  '0x1416946162b1c2c871a73b07e932d2fb6c932069': {
    name: 'Energi',
    symbol: 'NRGE',
  },
};
