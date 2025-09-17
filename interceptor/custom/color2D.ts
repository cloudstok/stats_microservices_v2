import { ARespMapper } from "../abstractMapper";

export class Color2DMapper extends ARespMapper {
    constructor() {
        super();
    };

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
    };

    history(resp: any[]) {
        return resp;
    };

    details(resp: any[]) {
        const e = resp[0];
        const adminData: any = {
            lobby_id: e.lobby_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            total_bet_amount: e.bet_amount,
            total_win_amount: e.win_amount,
            result: e.result,
            time: e.created_at
        };
        const userBets = JSON.parse(e.user_bets);
        userBets.map((bet: any, index: number) => {
            adminData[`bet_${index + 1}`] = bet;
        });
        return adminData;
    };
}
