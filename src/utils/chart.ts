import { LiveDataTimeframeEnum, BlockDataChart } from 'hooks/useBasicChartData';
import RoboTheme from 'styles';

const ONE_DAY_TIMESTAMP = 86400000;

export const calculateBaseline = (data) => {
  const first26 = data.slice(0, 26);
  const last26 = data.slice(-26);
  const minMaxFirst26 = [Math.min(...first26.map((d) => d)), Math.max(...first26.map((d) => d))];
  const minMaxLast26 = [Math.min(...last26.map((d) => d)), Math.max(...last26.map((d) => d))];
  const avgMinMax = (minMaxFirst26[0] + minMaxFirst26[1] + minMaxLast26[0] + minMaxLast26[1]) / 4;
  return avgMinMax;
};

export const getFirstTimestamp = (period: LiveDataTimeframeEnum | undefined) => {
  const nowTimestamp = new Date().getTime();
  switch (period) {
    case LiveDataTimeframeEnum.DAY:
      return nowTimestamp - ONE_DAY_TIMESTAMP;
    case LiveDataTimeframeEnum.WEEK:
      return nowTimestamp - 7 * ONE_DAY_TIMESTAMP;
    case LiveDataTimeframeEnum.MONTH:
      return nowTimestamp - 30 * ONE_DAY_TIMESTAMP;
    case LiveDataTimeframeEnum.YEAR:
      return nowTimestamp - 365 * ONE_DAY_TIMESTAMP;
    default:
      return nowTimestamp - 7 * ONE_DAY_TIMESTAMP;
  }
};

export const getSoulChart = (chartData: any, hoverValue: number | null) => {
  if (chartData && chartData.length > 0) {
    const firstValue = chartData[0].value;
    const lastValue = chartData[chartData.length - 1].value;

    const differentValue = hoverValue !== null ? hoverValue - lastValue : lastValue - firstValue;
    const compareValue = hoverValue !== null ? lastValue : firstValue;

    return {
      chartColor: lastValue - firstValue >= 0 ? RoboTheme.colors.mark : RoboTheme.colors.failure,
      different: parseFloat(differentValue.toPrecision(6)),
      percent: firstValue ? (compareValue === 0 ? 100 : ((differentValue / compareValue) * 100).toFixed(2)) : 0,
    };
  }
  return {
    chartColor: RoboTheme.colors.mark,
    different: 0.0,
    percent: '0',
  };
};

export const addZeroData = (data: BlockDataChart[], selectedChartPeriod: LiveDataTimeframeEnum | undefined) => {
  let timestamp = getFirstTimestamp(selectedChartPeriod);
  const zeroData = [];

  while (data[0].time - timestamp > ONE_DAY_TIMESTAMP) {
    zeroData.push({ time: timestamp, value: '0' });
    timestamp += ONE_DAY_TIMESTAMP;
  }
  return [...zeroData, ...data];
};

export const getPositionToolTip = (width: number, height: number, x: number, y: number) => {
  let left = x;

  if (left > width) {
    left = x - width;
  }

  let top = y;
  if (top > height) {
    top = y - height;
  }

  return {
    left,
    top,
  };
};

export const getTimeFrameHours = (timeFrame: LiveDataTimeframeEnum) => {
  switch (timeFrame) {
    case LiveDataTimeframeEnum.DAY:
      return 24;
    case LiveDataTimeframeEnum.WEEK:
      return 7 * 24;
    case LiveDataTimeframeEnum.MONTH:
      return 30 * 24;
    case LiveDataTimeframeEnum.YEAR:
      return 365 * 24;
    default:
      return 7 * 24;
  }
};
