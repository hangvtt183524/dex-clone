import BigNumber from 'bignumber.js';
import { Box } from 'components/Box';
import { Column } from 'components/Layout/Column';
import { RowFixed } from 'components/Layout/Row';
import Text from 'components/Text';
import { LiveDataTimeframeEnum } from 'hooks/useBasicChartData';
import { ColorType, Time, createChart } from 'lightweight-charts';
import moment from 'moment';
import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import RoboTheme from 'styles';
import { toNiceDate } from 'subgraph/contexts/utils';
import { TriangleIcon } from 'svgs';
import { calculateBaseline, getPositionToolTip, getSoulChart } from 'utils/chart';
import { displayBalanceEthValue } from 'utils/numbersHelper';

const BaseLineChart = ({
  data,
  selectedChartPeriod,
  hidePriceScale,
  width = 600,
  height = 300,
}: {
  data: { timestamp: string; close: string; open: string }[];
  selectedChartPeriod: LiveDataTimeframeEnum;
  hidePriceScale: boolean;
} & { width?: number; height?: number }) => {
  const chartContainerRef = useRef(null);
  const priceHoverRef = useRef(null);
  const popupPriceHoverRef = useRef(null);

  const renderTextHover = useCallback(({ amount, different, percent }) => {
    const amountHover = document.querySelector('.amount');
    const percentHover = document.querySelector('.percent');
    const amountPercentTick = document.querySelector('.amount-percent-tick');

    if (parseFloat(different) < 0) {
      priceHoverRef.current.classList.add('down');
      priceHoverRef.current.classList.remove('up');
    } else {
      priceHoverRef.current.classList.add('up');
      priceHoverRef.current.classList.remove('down');
    }

    amountHover.innerHTML = `$${displayBalanceEthValue(new BigNumber(amount), 'html')}`;
    percentHover.innerHTML = `${percent}%`;
    amountPercentTick.innerHTML = `$${displayBalanceEthValue(new BigNumber(different), 'html')}`;
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current || !data || data?.length === 0) return;

    const formattedData = data?.map((entry: any) => {
      return {
        time: parseFloat(entry.timestamp) as Time,
        value: parseFloat(entry.value),
        // open: parseFloat(entry.open),
        // low: parseFloat(entry.open),
        // close: parseFloat(entry.close),
        // high: parseFloat(entry.close),
      };
    });
    const chartContainerElement = chartContainerRef.current;
    const popupPriceHoverElement = popupPriceHoverRef.current;

    const widthLiveChart = chartContainerElement.clientWidth;
    const heightLiveChart = height || chartContainerElement.clientHeight;
    const toolTipWidth = 100;
    const toolTipHeight = 30;

    const chart = createChart(chartContainerElement, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: RoboTheme.colors.text,
        fontSize: 12,
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      rightPriceScale: {
        visible: !hidePriceScale,
      },
      width: widthLiveChart,
      height: heightLiveChart,
      localization: {
        priceFormatter: (price) => `$${displayBalanceEthValue(price, 'plain')}`,
      },
      timeScale: {
        tickMarkFormatter: (e) => toNiceDate(e),
      },
    });

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    const priceClose = formattedData[formattedData.length - 1].value;
    const baselinePrice = calculateBaseline(formattedData.map((item) => item.value));
    const baselineSeries = chart.addBaselineSeries({
      baseValue: { type: 'price', price: baselinePrice },
      topLineColor: 'rgba( 38, 166, 154, 1)',
      topFillColor1: 'rgba( 38, 166, 154, 0.28)',
      topFillColor2: 'rgba( 38, 166, 154, 0.05)',
      bottomLineColor: 'rgba( 239, 83, 80, 1)',
      bottomFillColor1: 'rgba( 239, 83, 80, 0.05)',
      bottomFillColor2: 'rgba( 239, 83, 80, 0.28)',
      lineWidth: 1,
      priceFormat: {
        type: 'price',
        precision: 18,
        minMove: 1 / 10 ** 17,
      },
    });

    const { percent, different } = getSoulChart(formattedData, null);

    renderTextHover({
      percent,
      amount: priceClose,
      different,
    });

    // update tooltip
    chart.subscribeCrosshairMove((param: any) => {
      const { time = null, point = {} } = param;
      const { y, x } = point;

      if (!time || x < 0 || x > widthLiveChart || y < 0 || y > heightLiveChart) {
        popupPriceHoverElement.style.display = 'none';
        const { percent, different } = getSoulChart(formattedData, null);
        renderTextHover({
          percent,
          amount: priceClose,
          different,
        });
        return;
      }

      const dateStr = moment(time * 1000).format('YYYY-MM-DD HH:mm');

      popupPriceHoverElement.style.display = 'block';
      const price = param.seriesPrices.get(baselineSeries);
      const priceHover = price || priceClose;
      const { percent, different } = getSoulChart(formattedData, priceHover);

      renderTextHover({
        percent,
        amount: price,
        different,
      });

      if (different < 0) {
        popupPriceHoverElement.classList.remove('up');
      } else {
        popupPriceHoverElement.classList.add('up');
      }

      popupPriceHoverElement.innerHTML =
        '<div style="color: #FFF">RoboEx.</div>' +
        `<div style="font-size: 18px; margin: 6px 0px">${displayBalanceEthValue(price, 'html')}</div>` +
        `<div style="font-size: 10px; color: ${RoboTheme.colors.textSubtle}">${dateStr}</div>`;

      const { left, top } = getPositionToolTip(toolTipWidth, toolTipHeight, x, y);

      popupPriceHoverElement.style.left = `${left}px`;
      popupPriceHoverElement.style.top = `${top}px`;
    });

    baselineSeries.setData(formattedData);

    try {
      chart.timeScale().fitContent();
      // eslint-disable-next-line no-empty
    } catch (e) {}

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chartContainerRef, selectedChartPeriod]);

  return (
    <StyledWrapper width={`${width}px`} height={`${height}px`}>
      <StyledWrapPriceHover ref={priceHoverRef} position="relative" width="fit-content" pr="24px">
        <Column mb="auto" mt="16px">
          <Text className="amount" fontSize={['16px', '', '22px']} color="textSubtle" fontWeight={600} />
          <RowFixed mt={['4px', '', '8px']}>
            <Text fontSize={['12px', '', '12px']} className="amount-percent-tick" />
            <RowFixed>
              <TriangleIcon className="triangle" ml="12px" mr="4px" width="9px" />
              <Text className="percent" fontSize="12px" lineHeight="12px" />
            </RowFixed>
          </RowFixed>
        </Column>
      </StyledWrapPriceHover>
      <Box ref={chartContainerRef}>
        <StyledPopupPriceHover ref={popupPriceHoverRef} className="price-hover" />
      </Box>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Box)`
  width: 100%;

  .tv-lightweight-charts {
    width: 100% !important;
    table {
      width: 100% !important;
    }
  }
`;

const StyledPopupPriceHover = styled(Box)`
  position: absolute;

  width: max-content;
  height: 80px;
  display: none;
  padding: 8px;
  box-sizing: border-box;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.failure};

  background-color: rgba(45, 55, 72, 0.7);
  text-align: left;
  z-index: 1000;
  top: 12px;
  left: 12px;
  pointer-events: none;
  border-radius: ${({ theme }) => theme.radius.small};

  &.up {
    color: ${({ theme }) => theme.colors.mark};
  }
`;

const StyledWrapPriceHover = styled(RowFixed)`
  &.up {
    .amount-percent-tick {
      color: ${({ theme }) => theme.colors.mark};
    }
    .triangle {
      fill: ${({ theme }) => theme.colors.mark};
      path {
        fill: ${({ theme }) => theme.colors.mark};
      }
    }
    .percent {
      color: ${({ theme }) => theme.colors.mark};
    }
  }

  &.down {
    .amount-percent-tick {
      color: ${({ theme }) => theme.colors.failure};
    }
    .percent {
      color: ${({ theme }) => theme.colors.failure};
    }

    .triangle {
      transform: rotate(180deg);
      fill: ${({ theme }) => theme.colors.failure};
      path {
        fill: ${({ theme }) => theme.colors.failure};
      }
    }
  }
`;
export default BaseLineChart;
