import { urlRoute } from 'config/endpoints';
import {
  SwapIcon,
  SwapActiveIcon,
  PoolsIcon,
  PoolsActiveIcon,
  FarmIcon,
  FarmActiveIcon,
  EarnIcon,
  EarnActiveIcon,
  FireBlueIcon,
  FireIcon,
} from 'svgs';

export const menuConfigs = [
  // {
  //   title: "Dashboard",
  //   Icon: DashboardIcon,
  //   IconActive: DashboardActiveIcon,
  //   route: urlRoute.home(),
  // },
  {
    title: 'Swap',
    Icon: SwapIcon,
    IconActive: SwapActiveIcon,
    route: urlRoute.swap(),
  },
  {
    title: 'Pools',
    Icon: PoolsIcon,
    IconActive: PoolsActiveIcon,
    route: urlRoute.pools(),
    subMenu: [],
  },
  {
    title: 'Farms',
    Icon: FarmIcon,
    IconActive: FarmActiveIcon,
    route: urlRoute.farms(),
  },
  // {
  //   title: 'Earn',
  //   Icon: EarnIcon,
  //   IconActive: EarnActiveIcon,
  //   route: urlRoute.earn(),
  // },

  // {
  //   title: 'Trending',
  //   Icon: FireIcon,
  //   IconActive: FireBlueIcon,
  //   route: urlRoute.trending(),
  // },
  // {
  //   title: 'More',
  //   Icon: MoreHorizontalIcon,
  //   IconActive: MoreHorizontalIcon,
  //   subMenu: [
  //     {
  //       title: 'Docs',
  //     },
  //   ],
  // },
];
