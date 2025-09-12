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

        const gd = e.game_data || {};
        const gameDataFormatted = {
            Green: gd.green && gd.green.length ? gd.green.join(", ") : "null",
            Orange: gd.orange && gd.orange.length ? gd.orange.join(", ") : "null",
            Purple: gd.purple && gd.purple.length ? gd.purple.join(", ") : "null"
        };

        return {
            bet_id: e.bet_id,
            bet_amount: e.bet_amount,
            max_mult: e.max_mult,
            win_amount: (e.bet_amount * e.max_mult).toFixed(2),
            //game_data: gameDataFormatted,
            status: e.status,
            created_at: e.created_at
        };
    };
}
