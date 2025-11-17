import React, { useEffect, useState, useRef } from 'react';
import './CryptoSlider.css';
import axios from 'axios';
import {
  SiBitcoin, SiEthereum, SiTether, SiRipple, SiLitecoin,
  SiBinance, SiCardano, SiPolkadot, SiDogecoin, SiSolana,
} from 'react-icons/si';

interface Crypto {
  id: string;
  icon: React.ComponentType<any>;
  name: string;
  color: string;
}

const cryptoData: Crypto[] = [
  { id: 'bitcoin', icon: SiBitcoin, name: 'بیت کوین', color: '#F7931A' },
  { id: 'ethereum', icon: SiEthereum, name: 'اتریوم', color: '#3C3C3D' },
  { id: 'tether', icon: SiTether, name: 'تتر', color: '#26A17B' },
  { id: 'ripple', icon: SiRipple, name: 'ریپل', color: '#00AAE4' },
  { id: 'litecoin', icon: SiLitecoin, name: 'لایت کوین', color: '#B8B8B8' },
  { id: 'binancecoin', icon: SiBinance, name: 'بایننس کوین', color: '#F3BA2F' },
  { id: 'cardano', icon: SiCardano, name: 'کاردانو', color: '#0033AD' },
  { id: 'polkadot', icon: SiPolkadot, name: 'پولکادات', color: '#E6007A' },
  { id: 'dogecoin', icon: SiDogecoin, name: 'دوج کوین', color: '#C2A633' },
  { id: 'solana', icon: SiSolana, name: 'سولانا', color: '#00FFA3' },
];

interface Prices { [key: string]: { usd: number }; }

const CryptoSlider: React.FC = () => {
  const [prices, setPrices] = useState<Prices>({});
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    
    const ids = cryptoData.map(c => c.id).join(',');
    axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
      .then(res => setPrices(res.data))
      .catch(err => console.error(err));

    // Carousel خودکار
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollBy({ left: 150, behavior: 'smooth' });
        if (sliderRef.current.scrollLeft + sliderRef.current.clientWidth >= sliderRef.current.scrollWidth) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (crypto: Crypto) => {
    alert(`جزئیات ${crypto.name}`);
  };

  return (
    <section className="crypto-slider">
      <h2>خرید و فروش آنی رمزارزها</h2>
      <div className="slider-container" ref={sliderRef}>
        {cryptoData.map(({ id, icon: Icon, name, color }, idx) => (
          <div className="crypto-item" key={idx} onClick={() => handleClick({ id, icon: Icon, name, color })}>
            <Icon className="crypto-icon" style={{ color }} />
            <div className="crypto-name">{name}</div>
            <div className="crypto-price">{prices[id]?.usd !== undefined ? `$${prices[id].usd}` : '...'}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CryptoSlider;


