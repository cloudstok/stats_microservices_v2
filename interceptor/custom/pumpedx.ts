import { ARespMapper } from "../abstractMapper";

export class PumpedxhMapper extends ARespMapper {
    constructor() {
        super();
    }
    formatter(path: string, resp: any[]) {
        if (!Array.isArray(resp) || !resp.length) return resp;

        let formattedResp;
        switch (path) {
            case "bet-history": formattedResp = this.history(resp);
                break;
            case "bet-details": formattedResp = this.details(resp);
                break;
            default: formattedResp = resp;
                break;
        }
        return formattedResp;
    }

    history = (resp: any[]) => resp.map(e => {

        const multKey = e.match_max_mult !== undefined ? "match_max_mult" : "round_max_mult";
        return {
            lobby_id: e.lobby_id,
            user_id: e.user_id ? `${e.user_id[0]}***${e.user_id.slice(-1)}` : "",
            operator_id:e.operator_id || null,
            bet_amount: e.bet_amount,
            max_mult: e.max_mult || 0,
            win_amount: e.win_amount || 0,
            [multKey]: e[multKey] ?? 0, 
            status: e.status,
            created_at: e.created_at
        }
    })

    details = (resp: any[]) => {
        return resp.reduce((acc, e, index) => {
            if (!e) return acc;

            acc[`bet_${index + 1}`] = {
                lobby_id: e.lobby_id,
                user_id: e.user_id ? `${e.user_id[0]}***${e.user_id.slice(-1)}` : "",
                operator_id: e.operator_id,
                bet_amount: e.bet_amount,
                max_mult: e.max_mult || 0,
                win_amount: e.win_amount || 0,
                created_at: e.created_at,
                round_max_mult: e.round_max_mult,
                status: e.status
            };
            return acc;
        }, {});
    };

}
