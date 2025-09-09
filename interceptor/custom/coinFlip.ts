import { ARespMapper } from "../abstractMapper";

export class CoinFlip extends ARespMapper {
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
        return {
            bet_id: e.bet_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            bet_amount: e.bet_amount,
            user_bets: e.user_bets,
            win_amount: e.win_amount,
            win_mult: e.win_mult,
            status: e.status,
            created_at: e.created_at,
        }
    });

    details(resp: any[]) {
        if (!resp || resp.length === 0) {
            return null; // prevent crash if resp is empty
        }

        const e = resp[0];

        const data: any = {
            bet_id: e.bet_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            bet_amount: e.bet_amount,
            win_amount: e.win_amount,
            win_mult: e.win_mult,
            flips: e.user_bets?.reduce((acc: any, bet: any, index: number) => {
                acc[`flip_${index + 1}`] = bet;
                return acc;
            }, {}) || {},
            status: e.status,
            created_at: e.created_at,
        };

        return data;
    }


}
