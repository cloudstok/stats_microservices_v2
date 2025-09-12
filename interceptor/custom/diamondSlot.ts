import { ARespMapper } from "../abstractMapper";

export class DiamondSlotMapper extends ARespMapper {
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
        return resp.map((e) => {
            return {
                ...e,
                player_id: `${e.player_id.slice(0, 2)}***${e.player_id.slice(-2)}`,
            };
        });
    }

    details(resp: any[]) {
        if (!resp || !resp.length) return {}
        const e = resp[0];
        return {
            lobby_id: e.match_id,
            user_id: `${e.player_id.slice(0, 2)}***${e.player_id.slice(-2)}`,
            operator_id: e.operator_id,
            total_bet_amount: e.bet_amt,
            bet_time: e.created_at,
            win_amount: e.won_amt,
            mult: e.result.multiplier,
            status: e.status
        };
    }

}
