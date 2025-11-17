import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CryptoNewsFeed.scss";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail?: string;
}

const CryptoNewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  const fetchNews = async () => {
    try {
      const url =
        "https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss";

      const res = await axios.get(url);

      const items: NewsItem[] = res.data.items.map((item: any) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description,
        thumbnail: item.thumbnail,
      }));

      setNews(items.slice(0, 10)); // ۱۰ خبر اول
    } catch (err) {
      console.error("News API Error:", err);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // هر ۵ دقیقه
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="news-feed">
      <h1>اخبار روز کریپتو</h1>

      <ul>
        {news.map((n, i) => (
          <li key={i} className="news-item">
            <a href={n.link} target="_blank" rel="noreferrer">
              {n.title}
            </a>
            <span className="date">
              {new Date(n.pubDate).toLocaleString("fa-IR")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CryptoNewsFeed;

