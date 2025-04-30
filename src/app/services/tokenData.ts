import { ITokenData } from '../../types/types.js';
import axios from "axios"
import { urlJoin } from 'url-join-ts';
import { CoingeckoConfig } from "../../config/coingecko.js";



export class TokenData {

    public contract_address: string;
    constructor(contract_address: string) {
        this.contract_address = contract_address;
    }

    public formatNumber = (value: string | number, decimals = 2) => {
        if (typeof value === 'number') {
            return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return String(value);
    };

    private makeKeyboard() {
        return {
            inline_keyboard: [
                [
                    { text: '📜 Description', callback_data: `description:${this.contract_address}` },
                    { text: '🏦 Exchanges', callback_data: `exchanges:${this.contract_address}` },
                ],
                [
                    { text: '🔗 Links', callback_data: `links:${this.contract_address}` },
                    { text: '📈 24h Chart', callback_data: `chart_24h:${this.contract_address}` },
                ],
            ],
        };
    }

    public async getDataFromCoingecko(rawData = false): Promise<{ message?: string, data: any, keyboard?: any, success: boolean }> {
        try {
            const URL = urlJoin(CoingeckoConfig.base_url, 'coins/id/contract', this.contract_address);
            const data = await axios.get(URL);
            const tokenData: ITokenData = data.data;
            const name = tokenData.name;
            const symbol = tokenData.symbol;
            const priceUsd = tokenData.market_data.current_price.usd;
            const priceChange24h = tokenData.market_data.price_change_percentage_24h;
            const marketCap = tokenData.market_data.market_cap.usd;
            const marketCapRank = tokenData.market_data?.market_cap_rank;
            const volume24h = tokenData.market_data.total_volume.usd;
            const ath = tokenData.market_data.ath.usd;
            const athDate = new Date(tokenData.market_data.ath_date.usd).toLocaleDateString();
            const atl = tokenData.market_data.atl.usd;
            const atlDate = new Date(tokenData.market_data.atl_date.usd).toLocaleDateString();
            const categories = tokenData.categories.join(', ');
            const sentiment = tokenData.sentiment_votes_up_percentage;
            const contract = tokenData.contract_address;

            // * send Raw Data to front-end
            if (rawData) return {
                data: tokenData,
                success: true
            }

            const message = `
🐶 <b>${name} (${symbol})</b> 🐶
💰 <b>Price:</b> $${this.formatNumber(priceUsd, 4)} <i>(${priceChange24h > 0 ? '+' : ''}${this.formatNumber(priceChange24h, 2)}% �${priceChange24h > 0 ? '📈' : '📉'})</i>
📊 <b>Market Cap:</b> $${this.formatNumber(marketCap / 1e6, 2)}M (#${marketCapRank})
📈 <b>24h Volume:</b> $${this.formatNumber(volume24h / 1e6, 2)}M
🔍 <b>More Info:</b>
🕰 <b>ATH:</b> $${this.formatNumber(ath, 2)} (${athDate})
🕳 <b>ATL:</b> $${this.formatNumber(atl, 5)} (${atlDate})
🏷 <b>Categories:</b> ${categories}
👥 <b>Sentiment:</b> ${this.formatNumber(sentiment, 2)}% Positive`.trim();

            return {
                message,
                data: tokenData,
                keyboard: this.makeKeyboard(),
                success: true
            };
        } catch (e: any) {
            console.log("E", e);
            return {
                message: e,
                data: null,
                keyboard: this.makeKeyboard(),
                success: false
            };
        }
    }
}

