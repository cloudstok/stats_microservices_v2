import { ARespMapper } from "../abstractMapper";

export class RunAndGuessMapper extends ARespMapper {
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
                result: JSON.parse(round.result)
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
                const roundResult = JSON.parse(row.result || "{}");
                for (const bet of bets) {
                    result.push({
                        ...bet,
                        lobby_id: row.lobby_id,
                        result: roundResult,
                        created_at: row.created_at,
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
        const bets = JSON.parse(rowData.userBets);
        const result = JSON.parse(rowData.result);
        bets.map((bet: any, index: number) => {
            finalData[`bet_${index + 1}`] = {
                lobby_id: rowData.lobby_id,
                result,
                time: rowData.created_at,
                ...bet
            }
        });
        return finalData;
    };
};