declare namespace NodeJS {
  interface ProcessEnv {
    WEBACY_BASE_URL : string
    BOT_TOKEN: string;
    COINGECKO_API_KEY: string
    MONGO_CONNECTION_STRING : string
    MONGO_RECONNECT_INTERVAL : number | string
  }
}