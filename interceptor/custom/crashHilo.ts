import { ARespMapper } from "../abstractMapper";

export class CrashHiLoMapper extends ARespMapper {
    constructor() {
        super();
    }

    formatter(path: string, resp: any[]) {
        let formattedResp;

        switch (path) {
            case "single-bet-history": formattedResp = resp;
                break;
            case "bet-history": formattedResp = this.history(resp);
                break;
            case "bet-details": formattedResp = this.details(resp);
                break;
            default: formattedResp = resp;
                break;
        }
        return formattedResp;
    }


    history(resp: any[]) {
        if (!Array.isArray(resp) || resp.length <= 0) return [];
        return resp;
    }

    details(resp: any[]) {
        if (!Array.isArray(resp) || resp.length === 0) return {};
        const e = resp[0];
        return {
            bet1: {
                user_id: e.player_id
                    ? `${e.player_id.slice(0, 2)}***${e.player_id.slice(-2)}`
                    : "",
                operator_id: e.operator_id,
                lobby_id: e.match_id,
                bet_amount: Number(e.bet_amt) || 0,
                max_mult: Number(e.result?.multiplier) || 0,
                created_at: e.created_at || null,
                status: e.status?.toLowerCase() || (e.win_amt > 0 ? "win" : "loss"),
                final_amount: Number(e.win_amt) || 0,
            }
        };
    }


}
