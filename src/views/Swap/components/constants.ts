import { ChartDisplayOptionEnum } from 'components/Chart/constants';

type LabelValue<T = string> = {
  value: T;
  label: string;
};

export const CHART_FILTER_ITEMS: LabelValue<ChartDisplayOptionEnum>[] = [
  // {
  //   label: '1h',
  //   value: ChartDisplayOptionEnum.HOUR,
  // },
  {
    label: '1D',
    value: ChartDisplayOptionEnum.DAY,
  },
  {
    label: '7D',
    value: ChartDisplayOptionEnum.WEEK,
  },
  {
    label: '1M',
    value: ChartDisplayOptionEnum.MONTH,
  },
  {
    label: '1Y',
    value: ChartDisplayOptionEnum.YEAR,
  },
];
