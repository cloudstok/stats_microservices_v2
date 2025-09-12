import { ARespMapper } from "../abstractMapper";

export class ThimblesMapper extends ARespMapper {
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
        return resp;
    }

    details(resp: any[]) {
        if (!resp || resp.length === 0) return {};

        const row = resp[0];

        return {
            round_id: row.Round_ID,
            user_id: row.User_ID,
            operator_id: row.OperatorId,
            total_bet_amount: row.Total_BetAmount,
            total_win_amount: row.Total_WinAmount,
            time: row.Time,
            multiplier: row.status == 'WIN' ? row.multiplier : 0.00,
            status: row.status,
            type: row.type
        };
    }
}
