export const urlRoute = {
  home: () => ({
    path: '/',
    to: '/',
    api: '',
  }),
  swap: () => ({
    path: '/swap',
    to: '/swap',
    api: '',
  }),

  addLiquidity: ({ inputCurrency = '', outputCurrency = '' }: { inputCurrency?: string; outputCurrency?: string }) => {
    let to = `/add${inputCurrency ? `?inputCurrency=${inputCurrency}` : ''}`;
    if (outputCurrency) {
      to += `&outputCurrency=${outputCurrency}`;
    }

    return {
      path: '/add?inputCurrency=[inputCurrency]&outputCurrency=[outputCurrency]',
      to,
      api: '',
    };
  },
  removeLiquidity: ({
    inputCurrency = '',
    outputCurrency = '',
  }: {
    inputCurrency?: string;
    outputCurrency?: string;
  }) => {
    let to = `/remove${inputCurrency ? `?inputCurrency=${inputCurrency}` : ''}`;
    if (outputCurrency) {
      to += `&outputCurrency=${outputCurrency}`;
    }

    return {
      path: '/remove?inputCurrency=[inputCurrency]&outputCurrency=[outputCurrency]',
      to,
      api: '',
    };
  },
  farms: () => ({
    path: '/farms',
    to: '/farms',
    api: '',
  }),
  earn: () => ({
    path: '/earn',
    to: '/earn',
    api: '',
  }),
  trending: () => ({
    path: '/trending',
    to: '/trending',
    api: '',
  }),
  pools: () => ({
    path: '/pools',
    to: '/pools',
    api: '',
  }),
  findPool: () => ({
    path: '/pools/find',
    to: '/pools/find',
    api: '',
  }),
  news: () => ({
    path: '/news',
    to: '/news',
    api: '',
  }),

  telegram: () => ({
    to: 'https://t.me/robo_inu',
  }),
  twitter: () => ({
    to: 'https://twitter.com/RGI_info',
  }),
  facebook: () => ({
    to: 'https://www.facebook.com/groups/318598893018719/',
  }),
  medium: () => ({
    to: 'https://roboglobal.medium.com/robo-inu-finance-739b203486fc',
  }),

  reddit: () => ({
    to: 'https://www.reddit.com/r/roboinu/',
  }),
  term: () => ({
    to: 'https://roboglobal.info/term',
  }),
};
