import React, { useEffect, useState, useRef } from "react";
import "./CryptoTicker.scss";

interface Coin {
  id: string;
  symbol: string;
  current_price: number | null;
  price_change_percentage_24h: number | null;
  image: string;
}

const CryptoTicker: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Helper function برای فرمت اعداد
  const formatNumber = (num?: number | null) =>
    num !== undefined && num !== null ? num.toFixed(2) : "...";

  // Fetch data از CoinGecko
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false"
        );
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error("Error fetching coin data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // هر ۱۰ ثانیه آپدیت
    return () => clearInterval(interval);
  }, []);

  // اسکرول خودکار مشابه Cointelegraph
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollBy({ left: 180, behavior: "smooth" });

        if (
          sliderRef.current.scrollLeft + sliderRef.current.clientWidth >=
          sliderRef.current.scrollWidth
        ) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 2500);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="crypto-ticker">
      <div className="ticker-track" ref={sliderRef}>
        {coins.map((coin) => (
          <div className="ticker-item" key={coin.id}>
            <img src={coin.image} alt={coin.symbol} className="icon" />
            <span className="symbol">{coin.symbol.toUpperCase()}</span>
            <span className="price">${formatNumber(coin.current_price)}</span>
            <span
              className={`change ${
                coin.price_change_percentage_24h !== null &&
                coin.price_change_percentage_24h >= 0
                  ? "up"
                  : "down"
              }`}
            >
              {formatNumber(coin.price_change_percentage_24h)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoTicker;
