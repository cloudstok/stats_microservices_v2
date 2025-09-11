import { ARespMapper } from "../abstractMapper";

export class TwentyOneMapper extends ARespMapper {
    constructor() {
        super();
    }

    formatter(path: string, resp: any[]) {
        let formattedResp;
        switch (path) {
            case "bet-history": formattedResp = this.history(resp);
                break;
            case "bet-details": formattedResp = this.details(resp);
                break;
            default: formattedResp = resp;
        }
        return formattedResp;
    }

    history(resp: any[]) {
        if (!Array.isArray(resp) || resp.length === 0) return [];

        return resp.map((row: any) => ({
            lobby_id: row.match_id,
            bet_id: row.id,
            user_id: row.user_id,
            operator_id: row.operator_id,
            bet_amount: Number(row.bet_amount || 0).toFixed(2),
            win_amount: Number(row.win_amount || 0).toFixed(2),
            max_mult: Number(row.max_mult || 0).toFixed(2),
            cards_number: row.cards_number || null,
            status: row.status,
            created_at: row.created_at
        }));
    }

    details(resp: any[]) {
        if (!resp || resp.length === 0) return {};

        const row = resp[0];
        return {
            round_id: row.match_id,
            user_id: row.user_id,
            operator_id: row.operator_id,
            bet_amount: Number(row.bet_amount || 0).toFixed(2),
            win_amount: Number(row.win_amount || 0).toFixed(2),
            max_mult: Number(row.max_mult || 0).toFixed(2),
            cards_number: row.cards_number || null,
            status: row.status,
            created_at: row.created_at
        };
    }
}
