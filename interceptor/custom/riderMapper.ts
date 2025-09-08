import { ARespMapper } from "../abstractMapper";

export class RiderMapper extends ARespMapper {
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
        const isWin = e.round_max_mult >= e.max_mult;
        return {
            lobby_id: e.lobby_id,
            user_id: e.user_id ? `${e.user_id[0]}***${e.user_id.slice(-1)}` : "",
            bet_amount: e.bet_amount,
            max_mult: e.max_mult || 0,
            payout: isWin ? e.bet_amount * e.max_mult : 0,
            status: isWin ? "Win" : "Loss",
            match_max_mult: e.round_max_mult || 0,
            created_at: e.created_at
        }
    })

    details = (resp: any[]) => {
        
        return resp.reduce((acc, e, index) => {
            if (!e) return acc;
            const isWin = e.round_max_mult >= e.max_mult;
            acc[`bet_${index + 1}`] = {
                lobby_id: e.lobby_id,
                user_id: e.user_id ? `${e.user_id[0]}***${e.user_id.slice(-1)}` : "",
                operator_id: e.operator_id,
                bet_amount: e.bet_amount,
                max_mult: e.max_mult || 0,
                payout: isWin ? e.bet_amount * e.max_mult : 0,
                status: isWin ? "Win" : "Loss",
                created_at: e.created_at,
                round_max_mult: e.round_max_mult
            };

            return acc;
        }, {});
    };

}