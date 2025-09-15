import { ARespMapper } from "../abstractMapper";

export class RedQueenMapper extends ARespMapper {

    constructor() {
        super();
    }

    formatter(path: string, resp: any) {
        let formattedResp;
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
        if (!Array.isArray(resp) || !resp.length) return {};

        // take the first row
        const row = resp[0];

        let cards: string[] = [];
        let queenPosition: number | null = null;

        try {
            if (row.card_data) {
                cards = JSON.parse(row.card_data);
            }
        } catch (err) {
            console.error("Failed to parse card_data:", row.card_data, err);
            cards = [];
        }

        cards.forEach((card: string, index: number) => {
            const [rank] = card.split(":");
            if (rank === "Q" && queenPosition === null) {
                queenPosition = index + 1; // 1-based index
            }
        });

        const betAmount = Number(row.bet_amount ?? 0);
        const winAmount = Number(row.win_amount ?? 0);

        return {
            lobby_id: row.match_id ?? null,
            user_id: row.user_id ?? null,
            operator_id: row.operator_id ?? null,
            bet_time: row.created_at ?? null,
            bet_amount: betAmount,
            win_amount: winAmount,
            mult: betAmount > 0 ? winAmount / betAmount : 0,
            status: row.status ?? "unknown",
            bet_position: row.position ?? null,
            winning_position: queenPosition
        };
    }
}