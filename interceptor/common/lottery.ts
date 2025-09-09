import { ARespMapper } from "../abstractMapper";

export class LotteryMapper extends ARespMapper {

    constructor() {
        super();
    }

    formatter(path: string, resp: any[], limit: number) {
        let formattedResp
        switch (path) {
            case "bet-history": formattedResp = this.history(resp, limit);
                break;
            case "bet-details": formattedResp = this.details(resp);
                break;
            case "lobby-details": formattedResp = this.lobbyDetails(resp);
                break;
            default: formattedResp = resp;
                break;
        }
        return formattedResp;
    }

    lobbyDetails(resp: any[]) {
        if (resp.length < 0) return [];
        const result = resp.map(round => {
            const roundObj = {
                lobby_id: round.lobby_id,
                result: JSON.parse(round.result)
            };
            return roundObj;
        });
        return result;
    }

    history(resp: any[], limit: number) {
        if (resp.length <= 0) return []
        const result: any[] = [];
        for (const row of resp) {
            try {
                const bets = JSON.parse(row.user_bets || "[]");
                const roundResult = JSON.parse(row.result || "{}");

                for (const bet of bets) {
                    result.push({
                        ...bet,
                        room_id: row.room_id,
                        bet_id: row.bet_id,
                        lobby_id: row.lobby_id,
                        user_id: row.user_id,
                        operator_id: row.operator_id,
                        total_bet_amount: row.bet_amount,
                        result: JSON.parse(roundResult),
                        status: bet.status,
                        created_at: row.created_at
                    });
                };
            } catch (e) {
                console.warn('Failed to parse userBets:', e);
            }
        }
        return result.slice(0, limit);

    };

    details(resp: any) {
        if (!resp || !Array.isArray(resp) || resp.length == 0) return {};
        const roundData = resp[0];
        const finalData: any = {
            lobby_id: roundData.lobby_id,
            total_bet_amount: roundData.bet_amount,
            total_win_amount: roundData.win_amount,
            time: roundData.created_at,
            result: JSON.parse(roundData.result)
        };
        const userBets = JSON.parse(roundData.user_bets);
        userBets.map((bet: any, index: number) => {
            finalData[`bet_${index + 1}`] = {
                bet_amount: bet.btAmt,
                chip: bet.chip,
                win_amount: bet.winAmt,
                status: bet.status,
                multiplier: bet.mult
            }
        });
        return finalData;
    }
}