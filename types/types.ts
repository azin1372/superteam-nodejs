export interface ITokenData {
    id: string;
    name: string;
    symbol: string;
    contract_address: string;
    categories: string[];
    description: {
      en: string;
    };
    market_data: IMarketData;
    links: ILinks;
    sentiment_votes_up_percentage: number;
    sentiment_votes_down_percentage: number;
    watchlist_portfolio_users: number;
    tickers: ITicker[];
  }
  
  export interface IMarketData {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
    ath: {
      usd: number;
    };
    ath_date: {
      usd: string; // ISO date string, e.g., "2024-03-31T00:00:00Z"
    };
    atl: {
      usd: number;
    };
    atl_date: {
      usd: string; // ISO date string
    };
    market_cap_rank: number;
  }
  
  export interface ILinks {
    homepage: string[];
    twitter_screen_name?: string;
    telegram_channel_identifier?: string;
  }
  
  export interface ITicker {
    market: {
      name: string;
      identifier: string;
    };
    converted_last: {
      usd: number;
    };
    converted_volume: {
      usd: number;
    };
  }