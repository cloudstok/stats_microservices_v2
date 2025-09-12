import { ARespMapper } from "../abstractMapper";

export class AndarBaharMapper extends ARespMapper {
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
            case "top-win": formattedResp = this.topWin(resp);
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
                wA: parseFloat(e.wA)
            };
        });
    };

    details(resp: any[]) {
        if (!resp || !resp.length) return {}
        const rowData = resp[0];
        const parsedBets = JSON.parse(rowData.bets);

        const resultData: any = {
            Round_ID: rowData.Round_ID,
            User_ID: rowData.User_ID,
            OperatorId: rowData.OperatorId,
            Total_BetAmount: rowData.Total_BetAmount,
            Total_WinAmount: rowData.Total_WinAmount,
            Time: rowData.Time,
        };

        parsedBets.forEach((bet: any, index: number) => {
            let betType;
            if (bet.betOn.trim() === "0") {
                betType = "ANDAR";
            } else if (bet.betOn.trim() === "1") {
                betType = "BAHAR";
            } else {
                betType = `JOCKER:${bet.betOn.trim()}`;
            };

            const isWin = Number(bet.payout) > 0;

            resultData[`Bet${index + 1}`] = {
                amount: bet.betAmount,
                type: betType,
                status: isWin ? "WIN" : "LOSS",
                win_amount: isWin ? Number(bet.payout).toFixed(2) : "0.00",
            };
        });
        return resultData;
    };

    topWin = (resp: any[]) => {
        const mask = (str: string) => `${str[0]}***${str.slice(-1)}`;
        return resp.map(row => {
            return {
                urId: row.user_id,
                wnAmt: row.total_winnings,
            }
        });
    };
};