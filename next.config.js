/** @type {import("next").NextConfig} */
/* eslint-disable no-param-reassign */
/* eslint @typescript-eslint/no-var-requires: "off" */

const withTM = require("next-transpile-modules")(["lightweight-charts", "fancy-canvas"]);

const nextConfig = {
  compress: false,
  reactStrictMode: false,
  compiler: {
    styledComponents: {
      minify: true,
      ssr: true
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ],
    unoptimized: true
  },

  async headers() {
    return [
      {
        source: "/assets/images/:all*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, immutable, max-age=86400"
          }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/swap",
        permanent: true
      }
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    });
    config.resolve.fallback = {
      fs: false,
      module: false
    };
    return config;
  },
  async exportPathMap(defaultPathMap) {
    const pathMap = {};

    for (const [path, config] of Object.entries(defaultPathMap)) {
      if (path === "/") {
        pathMap[path] = config;
      } else {
        pathMap[`${path}`] = config;
      }
    }
    return pathMap;
  }
};

module.exports = withTM(nextConfig);
