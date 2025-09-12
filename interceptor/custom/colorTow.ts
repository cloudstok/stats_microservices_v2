import { ARespMapper } from "../abstractMapper";

export class color_2 extends ARespMapper {
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
            lobby_id: e.lobby_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            bet_amount: e.bet_amount,
            profit: e.win_amount - e.bet_amount,
            max_mult: e.max_mult,
            created_at: e.created_at,
        }
    });


    details(resp: any[]) {
        if (!resp || resp.length === 0) {
            return null;
        }

        const e = resp[0];

        const betsObj = JSON.parse(e.userBets || "[]")?.reduce(
            (acc: any, bet: any, index: number) => {
                acc[`bet_${index + 1}`] = bet;
                return acc;
            },
            {}
        );

        const data: any = {
            lobby_id: e.lobby_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            bet_amount: e.bet_amount,
            win_amount: e.win_amount,
            max_mult: e.max_mult,
            created_at: e.created_at,
            ...betsObj, // 👈 spread bets into top-level
        };

        return data;
    }


    // userBets
}
