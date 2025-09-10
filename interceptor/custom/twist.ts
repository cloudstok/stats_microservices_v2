import { ARespMapper } from "../abstractMapper";

export class TwistMapper extends ARespMapper {
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

    history = (resp: any[]) => {
        if (!Array.isArray(resp) || resp.length <= 0) return [];

        return resp.map(e => {
            const finalAmount = (Number(e.bet_amount) * Number(e.max_mult)) - Number(e.bet_amount);
            return {
                ...e,
                profit: finalAmount.toFixed(2)
            }
        })
    }

    details = (resp: any[]) => {
        if (!resp || !resp.length) return {};
        const e = resp[0]
        return {
            round_id: e.lobby_id,
            bet_amount: e.bet_amount,
            win_amount: Number((e.bet_amount * e.max_mult) - e.bet_amount).toFixed(2),
            max_mult: e.max_mult || 0,
            status: e.status,
            created_at: e.created_at,
        };
    };
}