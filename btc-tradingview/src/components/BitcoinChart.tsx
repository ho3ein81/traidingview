import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import type { IChartApi, ISeriesApi, Time } from "lightweight-charts";
import DarkModeToggle from './DarkModeToggle'; // اضافه شد
import '../App.css';
import '../DarkModeToggle.scss'
interface Candle {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface BitcoinChartProps {
  symbol: string;
  darkMode: boolean;  // prop darkMode
  interval: string;
}

const BitcoinChart: React.FC<BitcoinChartProps> = ({ symbol, darkMode }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const smaSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const rsiChartRef = useRef<IChartApi | null>(null);
  const rsiSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const candlesRef = useRef<Candle[]>([]);

  // ---------- محاسبه SMA ----------
  function calculateSMA(candles: Candle[], period: number): number[] {
    const sma: number[] = [];
    for (let i = 0; i < candles.length; i++) {
      if (i < period - 1) {
        sma.push(NaN);
        continue;
      }
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) sum += candles[j].close;
      sma.push(sum / period);
    }
    return sma;
  }

  // ---------- محاسبه RSI ----------
  function calculateRSI(candles: Candle[], period = 14) {
    const rsi: { time: Time; value: number }[] = [];
    for (let i = period; i < candles.length; i++) {
      let gains = 0;
      let losses = 0;
      for (let j = i - period + 1; j <= i; j++) {
        const diff = candles[j].close - candles[j - 1].close;
        if (diff >= 0) gains += diff;
        else losses -= diff;
      }
      const rs = gains / (losses || 1);
      const rsiValue = 100 - 100 / (1 + rs);
      rsi.push({ time: candles[i].time, value: rsiValue });
    }
    return rsi;
  }

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const background = darkMode ? "#1E1E1E" : "#fff";
    const textColor = darkMode ? "#fff" : "#000";
    const upColor = "#26a69a";
    const downColor = "#ef5350";

    // ---------- چارت کندل‌ها و SMA ----------
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: background }, textColor },
      grid: { vertLines: { color: "#555" }, horzLines: { color: "#555" } },
    });

    candleSeriesRef.current = chartRef.current.addCandlestickSeries();
    candleSeriesRef.current.applyOptions({ upColor, downColor, wickUpColor: upColor, wickDownColor: downColor, borderVisible: false });
    smaSeriesRef.current = chartRef.current.addLineSeries({ color: "blue", lineWidth: 2 });

    // ---------- چارت RSI ----------
    rsiChartRef.current = createChart(document.getElementById("rsi-chart")!, {
      width: chartContainerRef.current.clientWidth,
      height: 150,
      layout: { background: { color: background }, textColor },
      grid: { vertLines: { color: "#555" }, horzLines: { color: "#555" } },
    });
    rsiSeriesRef.current = rsiChartRef.current.addLineSeries({ color: "purple", lineWidth: 2 });

    // ---------- دریافت دیتا و بارگذاری اولیه ----------
    const loadInitialData = async () => {
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=100`
      );
      const data = await res.json();
      const candles: Candle[] = data.map((item: any) => ({
        time: (item[0] / 1000) as Time,
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
      }));

      candlesRef.current = candles;
      candleSeriesRef.current?.setData(candles);
      const smaValues = calculateSMA(candles, 10);
      smaSeriesRef.current?.setData(candles.map((c, idx) => ({ time: c.time, value: smaValues[idx] })));

      const rsiValues = calculateRSI(candles, 14);
      if (rsiValues.length) rsiSeriesRef.current?.setData(rsiValues);
    };

    loadInitialData();

    // ---------- آپدیت زنده ----------
    const intervalId = setInterval(async () => {
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=1`
      );
      const data = await res.json();
      const item = data[0];
      const newCandle: Candle = {
        time: (item[0] / 1000) as Time,
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
      };

      candlesRef.current.push(newCandle);
      candleSeriesRef.current?.update(newCandle);

      const smaValues = calculateSMA(candlesRef.current, 10);
      smaSeriesRef.current?.setData(candlesRef.current.map((c, idx) => ({ time: c.time, value: smaValues[idx] })));

      const rsiValues = calculateRSI(candlesRef.current, 14);
      if (rsiValues.length) {
        const lastPoint = rsiValues[rsiValues.length - 1];
        rsiSeriesRef.current?.update(lastPoint);
      }
    }, 2000);

    // ---------- resize ----------
    const resize = () => {
      chartRef.current?.applyOptions({ width: chartContainerRef.current!.clientWidth });
      rsiChartRef.current?.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };
    window.addEventListener("resize", resize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", resize);
      chartRef.current?.remove();
      rsiChartRef.current?.remove();
    };
  }, [symbol, darkMode]);

  return (
    <div style={{ width: "100%", padding: "0 10px" }}>
      {/* Dark Mode Toggle */}
      {/* <DarkModeToggle darkMode={darkMode} setDarkMode={() => {}} /> کامپوننت اضافه شد */}
      
      <div ref={chartContainerRef} className="chart-container" />
      <div id="rsi-chart" style={{ marginTop: "20px" }} />
    </div>
  );
};

export default BitcoinChart;





