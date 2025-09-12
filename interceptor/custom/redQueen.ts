import { ARespMapper } from "../abstractMapper";

export class RedQueenMapper extends ARespMapper {

    constructor() {
        super();
    }

    formatter(path: string, resp: any) {
        let formattedResp;
        console.log(resp);
        switch (path) {
            case "bet-history":
                formattedResp = this.history(resp);
                break;
            case "bet-details":
                formattedResp = this.details(resp);
                break;
            default:
                formattedResp = resp;
                break;
        }
        return formattedResp;
    }
    history(resp: any[]) {
        return resp;
    }

    details(resp: any) {
        if (!resp) return {};

        const rankMap: Record<string, string> = { 'Q': 'Queen', 'J': 'Jack' };
        const suitMap: Record<string, string> = { 'H': 'Hearts', 'S': 'Spades', 'C': 'Clubs', 'D': 'Diamonds' };

        let cards: string[] = [];
        cards = JSON.parse(resp.card_data);
        let queenPosition: number | null = null;

        cards.forEach((card: string, index: number) => {
            const [rank] = card.split(':');
            if (rank && suitMap) {
                if (rank === 'Q' && queenPosition === null) {
                    queenPosition = index + 1; // 1-based index
                }
            }

        });

        return {
            lobby_id: resp.match_id,
            user_id: resp.user_id,
            operator_id: resp.operator_id,
            bet_time: resp.created_at,
            bet_amount: Number(resp.bet_amount),
            win_amount: Number(resp.win_amount),
            mult: resp.win_amount / resp.bet_amount,
            status: resp.status,
            bet_position: resp.position,
            winning_position: queenPosition
        };
    }
}