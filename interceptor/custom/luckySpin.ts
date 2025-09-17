import { ARespMapper } from "../abstractMapper";

export class LuckySpin extends ARespMapper {
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
            case "top-win": formattedResp = this.topWin(resp);
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
            win_amount: e.win_amount,
            win_mult: e.win_mult,
            status: e.status,
            created_at: e.created_at,
        }
    });

    details(resp: any[]) {
        const e = resp[0]
        return {
            bet_id: e.bet_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            bet_amount: e.bet_amount,
            win_amount: e.win_amount,
            win_mult: e.win_mult,
            status: e.status,
            created_at: e.created_at,
        }
    }

    topWin = (resp: any[]) => resp.map(e => {
        return {
            user_id: e.user_id,
            win_amount: e.win_amount,
        }
    });
}






