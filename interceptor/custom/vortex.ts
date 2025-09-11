import { ARespMapper } from "../abstractMapper";

export class VortexMapper extends ARespMapper {
    constructor() {
        super();
    }

    formatter(path: string, resp: any[]) {

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

    history = (resp: any[]) => {
        if (!Array.isArray(resp) || resp.length <= 0) return [];

        return resp.map(e => {
            return {
                bet_id: e.bet_id,
                bet_amount: e.bet_amount,
                max_mult: e.max_mult,
                game_data: e.game_data ? e.game_data : [],
                status: e.status,
                created_at: e.created_at,
                final_amount: (e.bet_amount * e.max_mult).toFixed(2)
            };
        });
    };

    details = (resp: any[]) => {
        if (!resp || !resp.length) return {};
        const e = resp[0];
        return {
            bet_id: e.bet_id,
            bet_amount: e.bet_amount,
            max_mult: e.max_mult,
            win_amount: (e.bet_amount * e.max_mult - e.bet_amount).toFixed(2),
            status: e.status,
            created_at: e.created_at
        };
    };
}
