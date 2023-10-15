/* eslint-disable max-len */
import axios from 'axios';
import { COINGECKO_API_URL } from 'config/constants';
import { PRICE_CHART_API } from 'config/env';
import { networks } from 'config/networks';
import { Currency, SupportedChainId, Token } from 'config/sdk-core';
import { getUnixTime, subHours } from 'date-fns';
import { useMemo } from 'react';
import useSWR from 'swr';
import { ChainIdSupportedChart } from 'config/constants/chains';
import { getTimeFrameHours } from 'utils/chart';
import {useSelectedChainNetwork} from 'state/user/hooks';

// import mockLpEthRobo from './mockLpEthRobo.json';
// import mockLpRoboEth from './mockLpRoboEth.json';

// import mockETH from './mockETH.json';
// import mockRobo from './mockRobo.json';

export enum LiveDataTimeframeEnum {
  DAY = '1D',
  WEEK = '1W',
  MONTH = '1M',
  YEAR = '1Y',
}
export interface BlockDataChart {
  time: number;
  value: number;
}

interface OriginDataCoingeckoMarket {
  prices: BlockDataChart[];
  marketCaps: BlockDataChart[];
  totalVolumes: BlockDataChart[];
}

export const CHART_FILTER_ITEMS: { label: string; value: LiveDataTimeframeEnum }[] = [
  {
    label: LiveDataTimeframeEnum.DAY,
    value: LiveDataTimeframeEnum.DAY,
  },
  {
    label: LiveDataTimeframeEnum.WEEK,
    value: LiveDataTimeframeEnum.WEEK,
  },
  {
    label: LiveDataTimeframeEnum.MONTH,
    value: LiveDataTimeframeEnum.MONTH,
  },
  {
    label: LiveDataTimeframeEnum.YEAR,
    value: LiveDataTimeframeEnum.YEAR,
  },
];

const generateCoingeckoUrl = (
  chainId: SupportedChainId,
  address: string | undefined,
  timeFrame: LiveDataTimeframeEnum | 'live',
): string => {
  if (!ChainIdSupportedChart.includes(chainId)) return '';

  const timeTo = getUnixTime(new Date());
  const timeFrom =
    timeFrame === 'live' ? timeTo - 1000 : getUnixTime(subHours(new Date(), getTimeFrameHours(timeFrame)));
  const cgkId = networks[chainId].otherInfo.coingeckoNetworkId;

  if (!cgkId) return '';

  return `${COINGECKO_API_URL}/coins/${cgkId}/contract/${address}/market_chart/range?vs_currency=usd&from=${timeFrom}&to=${timeTo}`;
};

const getClosestPrice = (prices: any[], time: number) => {
  let closestIndex = 0;
  prices.forEach((item, index) => {
    if (Math.abs(item[0] - time) < Math.abs(prices[closestIndex][0] - time)) {
      closestIndex = index;
    }
  });
  return prices[closestIndex][0] - time > 10000000 ? 0 : prices[closestIndex][1];
};

const fetchKyberDataSWR = async (url: string) => {
  const res = await axios.get(url, { timeout: 5000 });
  if (res.status === 204) {
    throw new Error('No content');
  }
  return res.data;
};

const fetchKyberDataSWRWithHeader = async (url: string) => {
  const res = await axios
    .get(url, {
      timeout: 5000,
      headers: {
        'accept-version': 'Latest',
      },
    })
    .catch((error) => {
      throw error;
    });

  if (res.status === 204) {
    throw new Error('No content');
  }
  return res.data;
};

const fetchPerTokenCoingeckotSWR = async (chainId: SupportedChainId, address: string, timeFrame: any): Promise<any> => {
  return axios
    .get(generateCoingeckoUrl(chainId, address, timeFrame), { timeout: 5000 })
    .then((res) => {
      if (res.status === 204) {
        // return mockLpEthRobo;

        throw new Error('No content');
      }
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

const fetchCoingeckoDataSWR = async (tokenAddresses: any, chainId: any, timeFrame: any): Promise<any> => {
  return Promise.all(
    [tokenAddresses[0], tokenAddresses[1]].map((address) => fetchPerTokenCoingeckotSWR(chainId, address, timeFrame)),
  );
};

const formatCoingeckoData = (
  data = {},
): {
  [key: string]: BlockDataChart[];
} =>
  Object.assign(
    {},
    ...Object.keys(data).map((key) => ({
      [key]:
        (data?.[key]?.map &&
          data[key].map((dataByKey) => ({
            time: dataByKey[0],
            value: dataByKey[1],
          }))) ||
        [],
    })),
  );

const MapperCoingeckoMarketRange = (data) =>
  data
    ? {
        marketCaps: data?.market_caps,
        prices: data?.prices,
        totalVolumes: data?.total_volumes,
      }
    : data;

export default function useBasicChartData(
  tokens: (Token | null | undefined | Currency)[],
  timeFrame: LiveDataTimeframeEnum,
): {
  data: BlockDataChart[];
  error: boolean;
  loading: boolean;
} {
  const chainId = useSelectedChainNetwork();

  // const { aggregatorDomain } = useKyberswapGlobalConfig();
  const aggregatorDomain = 'https://aggregator-api.kyberswap.com';
  const networkInfo = networks?.[chainId]?.otherInfo;

  // have wrapped token before querydata
  const [currencyIn, currencyOut] = useMemo(() => [tokens?.[0]?.wrapped, tokens?.[1]?.wrapped], [tokens]);

  const isReverse = useMemo(() => {
    if (
      !currencyIn ||
      !currencyOut ||
      currencyIn?.equals(currencyOut) ||
      currencyIn?.chainId !== currencyOut?.chainId ||
      !currencyIn?.sortsBefore
    )
      return false;

    const [token0] = currencyIn?.sortsBefore(currencyOut) ? [currencyIn, currencyOut] : [currencyOut, currencyIn];
    return token0 !== currencyIn;
  }, [currencyIn, currencyOut]);

  const tokenAddresses = useMemo(
    () =>
      [currencyIn, currencyOut].filter(Boolean).map((token) => {
        const tokenAdd = token?.address;
        // return isEVM ? tokenAdd?.toLowerCase() : tokenAdd;
        return tokenAdd?.toLowerCase();
      }) || [null, null],
    [currencyIn, currencyOut],
  );

  const [tokenAddressIn, tokenAddressOut] = tokenAddresses;

  // const coingeckoData = mockLpEthRobo;
  // const coingeckoError = false;
  // const coingeckoLoading = false;

  const {
    data: coingeckoData,
    error: coingeckoError,
    isValidating: coingeckoLoading,
  } = useSWR(tokenAddressIn && tokenAddressOut && [tokenAddresses, chainId, timeFrame], fetchCoingeckoDataSWR, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const {
    data: kyberData,
    error: kyberError,
    isValidating: kyberLoading,
  } = useSWR(
    coingeckoError && tokenAddressIn && tokenAddressOut
      ? `${PRICE_CHART_API}/price-chart?chainId=${chainId}&timeWindow=${timeFrame.toLowerCase()}&tokenIn=${tokenAddressIn}&tokenOut=${tokenAddressOut}`
      : null,
    fetchKyberDataSWR,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    },
  );

  const isKyberDataNotValid = useMemo(() => {
    if (kyberError || kyberData === null) return true;
    if (kyberData && kyberData.length === 0) return true;
    if (
      kyberData &&
      kyberData.length > 0 &&
      kyberData.every((item: any) => !item.token0Price || item.token0Price === '0')
    )
      return true;
    return false;
  }, [kyberError, kyberData]);

  const chartData = useMemo(() => {
    if (!isKyberDataNotValid && kyberData && kyberData.length > 0) {
      return kyberData
        .sort((a: any, b: any) => parseInt(a.timestamp) - parseInt(b.timestamp))
        .map((item: any) => {
          return {
            time: parseInt(item.timestamp) * 1000,
            value: !isReverse ? item.token0Price : item.token1Price || 0,
          };
        });
    }

    if (coingeckoData && coingeckoData[0]?.prices?.length > 0 && coingeckoData[1]?.prices?.length > 0) {
      const [data1, data2] = coingeckoData;
      return data1.prices.map((item: number[]) => {
        const closestPrice = getClosestPrice(data2.prices, item[0]);
        return { time: item[0], value: closestPrice > 0 ? parseFloat((item[1] / closestPrice).toPrecision(6)) : 0 };
      });
    }
    return [];
  }, [kyberData, coingeckoData, isKyberDataNotValid, isReverse]);

  const error = (!!kyberError && !!coingeckoError) || chartData.length === 0;

  const { data: liveKyberData } = useSWR(
    !isKyberDataNotValid && kyberData && chainId
      ? `${aggregatorDomain}/${networkInfo.aggregatorRoute}/tokens?ids=${tokenAddressIn},${tokenAddressOut}`
      : null,
    fetchKyberDataSWRWithHeader,
    {
      refreshInterval: 60000,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    },
  );

  const { data: liveCoingeckoData } = useSWR(
    isKyberDataNotValid && coingeckoData ? [tokenAddresses, chainId, 'live'] : null,
    fetchCoingeckoDataSWR,
    {
      refreshInterval: 60000,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    },
  );

  const latestData = useMemo(() => {
    if (isKyberDataNotValid) {
      if (liveCoingeckoData) {
        const [data1, data2] = liveCoingeckoData;
        if (data1.prices?.length > 0 && data2.prices?.length > 0) {
          const newValue = parseFloat(
            (data1.prices[data1.prices.length - 1][1] / data2.prices[data2.prices.length - 1][1]).toPrecision(6),
          );
          return { time: new Date().getTime(), value: newValue };
        }
      }
    } else if (liveKyberData) {
      const priceIn = liveKyberData[tokenAddressIn]?.price || 0;
      const priceOut = liveKyberData[tokenAddressOut]?.price || 0;
      const value = liveKyberData && tokenAddressIn && tokenAddressOut ? priceIn / priceOut : 0;
      if (value) return { time: new Date().getTime(), value };
    }
    return null;
  }, [isKyberDataNotValid, liveKyberData, liveCoingeckoData, tokenAddressIn, tokenAddressOut]);

  return {
    data: useMemo(() => (latestData ? [...chartData, latestData] : chartData), [latestData, chartData]),
    error,

    // ENABLE CHART
    // loading: !tokenAddressIn || !tokenAddressOut || kyberLoading || coingeckoLoading,
    loading: false,
  };
}

export function useBasicChartPriceCurrencyData(
  currency: Currency,
  timeFrame: LiveDataTimeframeEnum,
): {
  data: BlockDataChart[];
  error: boolean;
  loading: boolean;
  originData: {
    prices: BlockDataChart[];
    marketCaps: BlockDataChart[];
    totalVolumes: BlockDataChart[];
  };
} {
  const chainId = useSelectedChainNetwork();

  // have wrapped token before querydata
  const token = useMemo(() => currency?.wrapped || null, [currency]);

  // const coingeckoData = mockETH;
  // const coingeckoError = false;
  // const coingeckoLoading = false;

  const {
    data: coingeckoData,
    error: coingeckoError,
    isValidating: coingeckoLoading,
  } = useSWR(token && [chainId, token.address, timeFrame], fetchPerTokenCoingeckotSWR, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const getCoingeckoData = useMemo(
    () => MapperCoingeckoMarketRange(formatCoingeckoData(coingeckoData)) as unknown as OriginDataCoingeckoMarket,
    [coingeckoData],
  );

  const chartData = useMemo(() => getCoingeckoData?.prices || [], [getCoingeckoData]);

  const error = !!coingeckoError || chartData.length === 0;

  const { data: liveCoingeckoData } = useSWR(
    coingeckoData ? [chainId, token?.address, 'live'] : null,
    fetchPerTokenCoingeckotSWR,
    {
      refreshInterval: 60000,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    },
  );

  const latestData: BlockDataChart = useMemo(() => {
    if (liveCoingeckoData) {
      const dataPrice = liveCoingeckoData.prices;
      if (dataPrice?.length > 0) {
        const newValue = parseFloat(dataPrice[dataPrice.length - 1][1]).toPrecision(6);
        return { time: new Date().getTime(), value: parseFloat(newValue) };
      }
    }
    return { time: new Date().getTime(), value: 0 };
  }, [liveCoingeckoData]);

  return {
    originData: getCoingeckoData,
    data: useMemo(() => (latestData ? [...chartData, latestData] : chartData), [chartData, latestData]),
    error,
    // loading: !currency || coingeckoLoading,
    loading: false, // ENABLE CHART
  };
}
