import { Token } from 'config/sdk-core';

export enum EnumTrending {
  Trending = 'Trending',
  TrendingSoon = 'Trending Soon',
}

export const trendingTypeTabs = [
  {
    key: EnumTrending.Trending,
    title: 'Trending',
  },
  {
    key: EnumTrending.TrendingSoon,
    title: 'Trending Soon',
  },
];

export const DesktopColumnSchemaTrending = [
  {
    id: 1,
    name: 'rank',
    label: '#',
    textAlign: 'center',
  },
  {
    id: 2,
    name: 'currency',
    label: 'Name',
    textAlign: 'left',
  },
  {
    id: 3,
    name: 'discovered',
    label: 'Discovered On',
    textAlign: 'right',
  },
];

export type TreningCurreny = {
  rank: number;
  token: Token;
  discovered: number;
};

export interface ITableProps {
  currencySelected: string; // address
  onSelectCurrency: (address: string) => void;
  trendingLists: TreningCurreny[];
}
