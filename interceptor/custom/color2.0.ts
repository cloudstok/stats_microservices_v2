import { ARespMapper } from "../abstractMapper";

export class Color2_0 extends ARespMapper {
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

    history = (resp: any[]) => resp.map(row => {
        return {
            lobby_id: row.lobby_id,
            user_id: row.user_id,
            operator_id: row.operator_id,
            totalBetAmount: Number(row.bet_amount).toFixed(2),
            max_mult: Number(row.max_mult).toFixed(2),
            userBets: typeof row.userBets === "string" ? JSON.parse(row.userBets) : row.userBets,
            result: typeof row.result === "string" ? JSON.parse(row.result) : row.result,
            winAmount: Number(row.win_amount).toFixed(2),
            created_at: row.created_at
        }
    });


    details(resp: any[]) {
        if (!resp || resp.length === 0) {
            return null;
        }

        const e = resp[0];

        const colorMap: Record<number, string> = {
            1: "Yellow",
            2: "White",
            3: "Purple",
            4: "Blue",
            5: "Red",
            6: "Green"
        };

        const userBets = typeof e.userBets === "string" ? JSON.parse(e.userBets) : e.userBets;

        const betsObj = (userBets || []).reduce(
            (acc: any, bet: any, index: number) => {
                acc[`bet_${index + 1}`] = {
                    ...bet,
                    betAmount: Number(bet.betAmount).toFixed(2),
                    winAmount: Number(bet.winAmount).toFixed(2),
                    mult: Number(bet.mult).toFixed(2),
                };
                return acc;
            },
            {}
        );

        const resultArray = typeof e.result === "string" ? JSON.parse(e.result) : e.result;
        const result = (resultArray || []).map((num: number) => colorMap[num] || num);

        const data: any = {
            user_id: e.user_id,
            operator_id: e.operator_id,
            totalBetAmount: Number(e.bet_amount).toFixed(2),
            totalWinAmount: Number(e.win_amount).toFixed(2),
            ...betsObj,
            result: result
        };

        return data;
    }

}
