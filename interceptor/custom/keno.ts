import { ARespMapper } from "../abstractMapper";

export class KenoMapper extends ARespMapper {
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
                break;
        }
        return formattedResp;
    }


    history(resp: any[]) {
        if (!Array.isArray(resp) || resp.length <= 0) return [];
        return resp.map((e) => {
            return {
                user_id: e.user_id ? `${e.user_id.slice(0, 2)}***${e.user_id.slice(-2)}` : "",
                ...e
            };
        });
    }

    details(resp: any[]) {
        if (!resp || !resp.length) return {}
        const e = resp[0];

        return {
            lobby_id: e.match_id,
            user_id: e.user_id ? `${e.user_id.slice(0, 2)}***${e.user_id.slice(-2)}` : "",
            operator_id: e.operator_id,
            total_bet_amount: e.bet_amt,
            win_amount: e.win_amt,
            mult: e.win_mult,
            status: e.status,
            bet_time: e.created_at,
        };
    }

}
