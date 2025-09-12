import { ARespMapper } from "../abstractMapper";

export class Quick3DLotteryMapper extends ARespMapper {
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
                const bets = JSON.parse(row.user_bets || "[]");
                const roundResult = JSON.parse(row.result || "{}");
                for (const bet of bets) {
                    result.push({
                        ...bet,
                        lobby_id: row.lobby_id,
                        result: roundResult,
                        created_at: row.created_at,
                        room_id: row.room_id
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
        const finalData: any = {};
        const bets = JSON.parse(rowData.user_bets);
        const result = JSON.parse(rowData.result);
        bets.map((bet: any, index: number) => {
            finalData[`bet_${index + 1}`] = {
                room_id: rowData.room_id,
                lobby_id: rowData.lobby_id,
                result_a: result?.a,
                result_b: result?.b,
                result_c: result?.c,
                time: rowData.created_at,
                ...bet
            }
        });
        return finalData;
    };
};