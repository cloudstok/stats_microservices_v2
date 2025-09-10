import { ARespMapper } from "../abstractMapper";

export class PlinkoMapper extends ARespMapper {
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
                bet: e.bet_amount,
                multiplier: e.max_mult,
                cashout: e.win_amount,
                dateTime: e.created_at,
                userId: `${e.user_id.slice(0, 2)}***${e.user_id.slice(-2)}`,
                lobbyId: e.lobby_id,
                pins: e.pins,
                color: e.section
            };
        });
    }

    details(resp: any[]) {
        if (!resp || !resp.length) return {}
        const e = resp[0];
        return {
            bet_amount: e.bet_amount,
            max_mult: e.max_mult,
            win_amount: e.win_amount,
            created_at: e.created_at,
            user_id: e.user_id ? `${e.user_id.slice(0, 2)}***${e.user_id.slice(-2)}` : "",
            operator_id: e.operator_id,
            lobby_id: e.lobby_id,
            pins: e.pins,
            color: e.section
        };
    }

}
