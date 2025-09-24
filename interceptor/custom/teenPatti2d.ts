import { ARespMapper } from "../abstractMapper";

export class TeenPatti2DMapper extends ARespMapper {
    constructor() {
        super();
    }

    formatter(path: string, resp: any[]) {
        let formattedResp;
        switch (path) {
            case "bet-history":
                formattedResp = this.history(resp);
                break;
            case "bet-details":
                formattedResp = this.details(resp);
                break;
            default:
                formattedResp = resp;
                break;
        }
        return formattedResp;
    }

    history(resp: any[]) {
        return resp.map((entry: any) => {
            // const settledBets = (entry.settled_bets || []).map((e: any) => {
            //     if (!e || e.odds == null) return e;
            //     return {
            //         ...e,
            //         odds: Number(e.odds) >= 2 ? Number(e.odds) - 1 : Number(e.odds),
            //     };
            // });

            return {
                round_id: entry.round_id,
                user_id: entry.user_id,
                operator_id: entry.operator_id,
                total_bet_amount: entry.bet_amt,
                total_win_amount: entry.win_amt,
                result: entry.round_result,
                bet_values: entry.bet_values || [],
                settled_bets: entry.settled_bets || [],
                status: entry.status,
                created_at: entry.created_at,
            };
        });
    }

    details(resp: any[]) {
        const entry = resp[0] || {};
        if (!Object.keys(entry).length) return {};

        const roundResult = entry.round_result || {};
        const finalData: any = {
            bet_time: entry.created_at,
            lobby_id: entry.round_id,
            user_id: entry.user_id,
            operator_id: entry.operator_id,
            total_bet_amount: entry.bet_amt,
            total_win_amount: entry.win_amt || 0,
            roundResult,
        };

        const settledBets = entry.settled_bets || [];

        // Convert array into Bet1, Bet2, ...
        settledBets.forEach((b: any, idx: number) => {
            finalData[`Bet${idx + 1}`] = { ...b };
        });

        return finalData;
    }



}