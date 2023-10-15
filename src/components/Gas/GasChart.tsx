import React, { useMemo } from 'react';
import { Box, BoxProps } from 'components/Box';
import styled from 'styled-components';
import { GasPriceTypes } from 'state/user/actions';
import { dataInforGasFee } from './types';
import Text from '../Text';
import { displayBalanceEthValue } from '../../utils/numbersHelper';

const GasChart: React.FC<{ price: number } &BoxProps> = ({ price, ...props}) => {
    const type = GasPriceTypes.REGULAR;
    
    const [infoGasType] = useMemo(() => {
        const info = dataInforGasFee.find((gas) => gas.type === type);
        // const gasPrice = gasPriceCost[type];
        return [info];
    }, [type]);
    
    return (
        <Wrapper {...props}>
            <svg width="200" height="200" viewBox="-140 -140 280 242" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient
                        id="paint0_linear_0_1"
                        x1="-5.57147"
                        y1="95.6186"
                        x2="295.94"
                        y2="99.5003"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(1, 0, 0, 1.000001, 0.000056, -0.000062)"
                    >
                        <stop stopColor="#68E0CF" />
                        <stop offset="0.4817" stopColor="#6713D2" />
                        <stop offset="1" stopColor="#FF5442" />
                    </linearGradient>
                    <filter
                        id="filter0_d_0_1"
                        x="116.045"
                        y="127.598"
                        width="46.8574"
                        height="46.8577"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dy="10" />
                        <feGaussianBlur stdDeviation="7.5" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.0352941 0 0 0 0 0.0784314 0 0 0 0 0.0941176 0 0 0 1 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
                    </filter>
                </defs>
                <mask
                    id="mask0_0_1"
                    style={{
                        maskType: 'alpha',
                    }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="280"
                    height="242"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M41.8387 220.141C0.592831 169.494 2.93581 95.7467 49.1194 49.504C98.4555 0.104787 179.139 0.799225 229.331 51.055C279.38 101.169 280.211 181.642 230.888 231.488L230.879 231.496L229.564 233.495C228.694 235.682 229.161 238.294 230.953 240.089C233.283 242.422 236.994 242.512 239.526 240.171L239.543 240.154L249.024 229.632C293.262 175.117 289.37 94.1345 237.838 42.5365C182.866 -12.5057 94.499 -13.2663 40.4642 40.8377C-13.5702 94.9412 -12.8106 183.422 42.1612 238.464L44.18 239.816C46.3056 240.694 48.807 240.329 50.7341 238.546L50.7511 238.529C53.0887 235.994 52.9989 232.278 50.6689 229.945L41.8387 220.141Z"
                        fill="white"
                    />
                </mask>
                <g mask="url(#mask0_0_1)" transform="matrix(1.001976, -0.000043, -0.000043, 0.999884, -139.95804, -140.804064)">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M 50.181 245.413 L 143.855 140.662 L 233.406 265.512 C 240.086 260.751 246.456 255.376 252.439 249.385 C 311.416 190.332 310.643 93.672 250.714 33.667 C 190.785 -26.339 94.248 -27.113 35.271 31.939 C -6.531 73.795 -47.872 139.564 35.324 249.332 L 35.554 249.257 C 35.639 250.846 38.027 253.334 39.244 254.552 C 41.85 257.161 46.047 257.195 48.611 254.628 C 50.874 252.362 51.946 248.001 50.181 245.413 Z"
                        fill="url(#paint0_linear_0_1)"
                        transform="matrix(0.999963, 0.008683, -0.008769, 0.999961, 1.11751, -1.225381)"
                    />
                </g>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M -0.419 10.175 C -6.218 10.175 -10.919 5.425 -10.919 -0.434 C -10.919 -6.294 -6.218 -11.044 -0.419 -11.044 C 5.38 -11.044 10.081 -6.294 10.081 -0.434 C 10.081 5.425 5.38 10.175 -0.419 10.175 Z"
                    stroke="#244351"
                />
                <path
                    opacity="0.3"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M -0.419 42.004 C -23.615 42.004 -42.418 23.003 -42.418 -0.434 C -42.418 -23.872 -23.615 -42.872 -0.419 -42.872 C 22.777 -42.872 41.581 -23.872 41.581 -0.434 C 41.581 23.003 22.777 42.004 -0.419 42.004 Z"
                    stroke="#244351"
                />
                <path
                    opacity="0.1"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M -0.419 52.613 C -29.414 52.613 -52.918 28.863 -52.918 -0.434 C -52.918 -29.732 -29.414 -53.483 -0.419 -53.483 C 28.577 -53.483 52.081 -29.732 52.081 -0.434 C 52.081 28.863 28.577 52.613 -0.419 52.613 Z"
                    stroke="#244351"
                />
                <path
                    opacity="0.1"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M -0.419 63.223 C -35.213 63.223 -63.42 34.722 -63.42 -0.434 C -63.42 -35.591 -35.213 -64.091 -0.419 -64.091 C 34.375 -64.091 62.58 -35.591 62.58 -0.434 C 62.58 34.722 34.375 63.223 -0.419 63.223 Z"
                    stroke="#244351"
                />
                <path
                    opacity="0.1"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M -0.419 73.832 C -41.012 73.832 -73.92 40.582 -73.92 -0.434 C -73.92 -41.45 -41.012 -74.701 -0.419 -74.701 C 40.174 -74.701 73.081 -41.45 73.081 -0.434 C 73.081 40.582 40.174 73.832 -0.419 73.832 Z"
                    stroke="#244351"
                />
                <path
                    opacity="0.05"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M -0.419 85.209 C -46.81 85.209 -84.419 47.208 -84.419 0.333 C -84.419 -46.544 -46.81 -84.543 -0.419 -84.543 C 45.973 -84.543 83.581 -46.544 83.581 0.333 C 83.581 47.208 45.973 85.209 -0.419 85.209 Z"
                    stroke="#244351"
                />
                <path
                    opacity="0.8"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M -0.419 20.785 C -12.017 20.785 -21.419 11.284 -21.419 -0.434 C -21.419 -12.154 -12.017 -21.653 -0.419 -21.653 C 11.179 -21.653 20.581 -12.154 20.581 -0.434 C 20.581 11.284 11.179 20.785 -0.419 20.785 Z"
                    stroke="#244351"
                />
                <path
                    opacity="0.5"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M -0.419 31.394 C -17.816 31.394 -31.919 17.143 -31.919 -0.434 C -31.919 -18.013 -17.816 -32.263 -0.419 -32.263 C 16.978 -32.263 31.081 -18.013 31.081 -0.434 C 31.081 17.143 16.978 31.394 -0.419 31.394 Z"
                    stroke="#244351"
                />
                <g>
                    <g filter="url(#filter0_d_0_1)" transform="matrix(0.996589, 0, 0, 1.006975, -139.415955, -142.445496)">
                        <rect
                            width="16.8576"
                            height="16.8576"
                            rx="8.42878"
                            transform="matrix(-1 0 0 1 147.902 132.598)"
                            fill="#68E0CF"
                        />
                    </g>
                    <path
                        className={`gasmeter-needle ${infoGasType.chartType}`}
                        d="M 16.673 16.375 L -69.854 -69.201"
                        stroke="#68E0CF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        transform="matrix(-0.03454, -0.999403, 0.999403, -0.03454, 0.000423, -0.00021)"
                    />
                </g>
            </svg>

            <StyledTooltip className={infoGasType.chartType}>
                <StyledContainerTooltip>
                    <Text fontSize="10px" color="textSubtle">Gas price: {displayBalanceEthValue(price * infoGasType.multi)} Gwei</Text>
                </StyledContainerTooltip>
            </StyledTooltip>
        </Wrapper>
    )
}

const Wrapper = styled(Box)`
  @include wrapper;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 1em 0 1em;

  :not(:first-child) {
    z-index: 1;
  }

  svg {
    .gasmeter-needle {
      transition: all 0.25s ease-in-out;
      transform: rotate(-92deg);
    }
    .gasmeter-needle.slow {
      transform: rotate(-60deg);
    }
    .gasmeter-needle.everage {
      transform: rotate(45deg);
    }
    .gasmeter-needle.fast {
      transform: rotate(120deg);
    }
  }
  .gas-chosen-speed {
    margin-top: -2em;
    font-weight: 700;
    font-size: 10px;
    line-height: 0px;
    text-align: center;
    text-transform: uppercase;
  }

  .des-pass {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #adc0d1;
    align-self: center;

    .center {
      align-self: center !important;
      text-align: center;
    }

    .pd2 {
      padding: 0 0 1em 0;
    }
  }

  .gas-chosen {
    width: 100%;
    .gas-price-wrapper {
      width: 100%;
      padding: 0.3em;
      border: 1px solid #555555;
      border-radius: 20px;
      margin-bottom: 5px;
      .gas-price {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: center;
        justify-items: center;

        :first-child {
          justify-self: left;
          height: 25px;
          margin-left: 0.3em;
          span {
            margin-left: 0.5em;
            font-size: 12px;
            color: #adc0d1;
            font-weight: 500;
          }
        }
        .quantity {
          cursor: pointer;
          font-weight: 700;
        }
        .price {
          font-size: 12px;
          color: #adc0d1;
          font-weight: 500;
          justify-self: end;
          margin-right: 1em;
        }
      }
    }
  }

  .stat-table {
    width: 100%;

    .gas-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 2px;

      td {
        background: rgba(255, 255, 255, 0.02);
        backdrop-filter: blur(90px);
        border-radius: 5px;

        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        color: #adc0d1;
        opacity: 0.6;
      }
    }
  }
`;

const StyledTooltip = styled(Box)`
  position: absolute;
  transition: all 0.1s ease-in-out;

  &.slow {
    top: 220px;
    left: 10px;
    transform: translateY(-50%);
  }
  &.everage {
    top: 60px;
    left: 20%;
    transform: translateX(-50%);
  }
  &.fast {
    top: 150px;
    left: 30%;
    transform: translateY(-50%);
  }
`;

const StyledContainerTooltip = styled(Box)`
  padding: 4px;
  font-size: 12px;
  border-radius: ${({ theme }) => theme.radius.small};
  background: #1a2537;
  position: relative;
  z-index: ${({ theme }) => theme.zIndices.modal};

  max-width: 80px;
  word-break: break-word;
`;

export default GasChart;