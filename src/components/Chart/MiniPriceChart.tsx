import { createChart, ColorType, Time } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import RoboTheme from 'styles';
import { getSoulChart } from 'utils/chart';

const LiveChart = (props) => {
  const { data } = props;

  const chartContainerRef = useRef(null);

  useEffect(() => {
    const formattedData = data?.map((entry) => {
      return {
        time: parseFloat(entry.timestamp) as Time,
        value: parseFloat(entry.close),
        // open: parseFloat(entry.open),
        // low: parseFloat(entry.open),
        // close: parseFloat(entry.close),
        // high: parseFloat(entry.close),
      };
    });

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: RoboTheme.colors.textSubtle,
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
        visible: false,
      },
      timeScale: {
        visible: false,
        borderVisible: false,
      },
      handleScale: {
        mouseWheel: false,
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
      },
      crosshair: {
        horzLine: {
          visible: false,
        },
        vertLine: {
          visible: false,
        },
      },

      width: chartContainerRef.current.clientWidth,
      height: 35,
    });
    const { chartColor } = getSoulChart(formattedData, null);

    const lineSeries = chart.addLineSeries({
      color: chartColor,
      lineWidth: 1,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
    });
    lineSeries.setData(formattedData);

    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} />;
};
export default LiveChart;
