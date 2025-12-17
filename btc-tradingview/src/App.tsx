import { useState } from "react";
import "./App.css";
import DarkModeToggle from "./components/DarkModeToggle";
import BitcoinChart from "./components/BitcoinChart";
import CryptoSlider from './components/CryptoSlider';
import CryptoNewsFeed from './components/Feed';
import CryptoTicker from "./components/CryptoTicker";


function App() {
  const [interval] = useState("1m");
  const [darkMode, setDarkMode] = useState(false);

  return (


    
    <div className={`app-root ${darkMode ? "dark" : ""}`}>

      <header className="topbar">
        <div className="brand">Bitcoin TradingView</div>
        <div className="darkmode-wrapper">
          BTC/USDT
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
       
        
      </header>
      <div className="cryptotricker">
        <CryptoTicker />
      </div>
       
 
      

              <aside className="sidepanel">

                <div className="textpanel">
   
          <h3>Market Info</h3>
          <ul>
            <li>Source: Binance</li>
            <li>Timeframe: {interval}</li>
            <li>Status:<p className="connected">Connected</p></li>
          </ul>
          </div>
        </aside>

      <main className="main">
        <section className="chart-area">
          <BitcoinChart symbol="BTCUSDT" darkMode={darkMode} interval={interval} />
        </section>

 
      </main>
      <div className=" slider">
        <CryptoSlider/>
       </div>
      <br />
      
      <CryptoNewsFeed />

     
    </div>


  );
}

export default App;

