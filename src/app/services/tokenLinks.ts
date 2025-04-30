import { ITokenData } from "../../types/types"



export class TokenLinks {

    private tokenData: ITokenData;

    constructor(tokenData: ITokenData) {
        this.tokenData = tokenData
    }


    generateLinks () :string {
        const links = this.tokenData.links.homepage.filter((url: string) => url).map((url: string) => `<a href="${url}">${url}</a>`).join('\n');
        const twitter = this.tokenData.links.twitter_screen_name ? `<a href="https://twitter.com/${this.tokenData.links.twitter_screen_name}">Twitter</a>` : '';
        const telegram = this.tokenData.links.telegram_channel_identifier ? `<a href="https://t.me/${this.tokenData.links.telegram_channel_identifier}">Telegram</a>` : '';

        return `🔗 <b>Links:</b>\n${links}\n${twitter}\n${telegram}`;
    }
}