import { ARespMapper } from "../abstractMapper";

export class IndiaLotteryMapper extends ARespMapper {
    constructor() {
        super();
    }

    formatter(path: string, resp: any[], limit: number) {
        let formattedResp;
        switch (path) {
            case "bet-history":
                formattedResp = this.history(resp, limit);
                break;
            case "bet-details":
                formattedResp = this.details(resp);
                break;
            case "lobby-details": formattedResp = this.lobbyDetails(resp);
                break;
            default:
                formattedResp = resp;
                break;
        }
        return formattedResp;
    };

    lobbyDetails(resp: any[]) {
        if (resp.length < 0) return [];
        const result = resp.map(round => {
            const roundObj = {
                lobby_id: round.lobby_id,
                result: JSON.parse(round.result),
                created_at: round.created_at
            };
            return roundObj;
        });
        return result;
    };

    history = (resp: any[], limit: number) => {
        if (resp.length <= 0) return []
        const result: any[] = [];
        for (const row of resp) {
            try {
                const bets = JSON.parse(row.userBets || "[]");
                for (const bet of bets) {
                    result.push({
                        ...bet,
                        lobby_id: row.lobby_id,
                        bet_id: row.bet_id,
                        user_id: row.user_id,
                        operator_id: row.operator_id,
                        result: row.result,
                        max_mult: row.max_mult,
                        win_amount: bet.status == "win" ? Number(bet.winAmount).toFixed(2) : '0.00',
                        created_at: row.created_at,
                        betAmount: Number(bet.betAmount).toFixed(2)
                    });
                };
            } catch (e) {
                console.warn('Failed to parse userBets:', e);
            }
        };
        return result.slice(0, limit);
    };

    details = (resp: any[]) => {
        if (!resp || resp.length == 0) return {};
        const rowData = resp[0];
        const finalData: any = {
            lobby_id: rowData.lobby_id,
            user_id: rowData.user_id,
            operator_id: rowData.operator_id,
            result: rowData.result,
            created_at: rowData.created_at
        };
        const bets = JSON.parse(rowData.userBets);
        bets.map((bet: any, index: number) => {
            finalData[`bet_${index + 1}`] = {
                ...bet,
            }
        });
        return finalData;
    };
};