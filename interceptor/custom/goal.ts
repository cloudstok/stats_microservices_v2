import { ARespMapper } from "../abstractMapper";

export class GoalMapper extends ARespMapper {
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
        if (!resp || resp.length <= 0) return [];

        return resp.map((row: any) => {
            let parsedGameData: any = {};
            try {
                parsedGameData = row.gamedata
                    ? JSON.parse(JSON.parse(row.gamedata))
                    : {};
            } catch (e) {
                console.error("Failed to parse gamedata:", row.gamedata, e);
            }

            return {
                ID: row.id,
                Bet: row.bet ?? row.bet_amount ?? "0.00",
                X: row.x ?? row.multiplier ?? "1.00",
                Cashout: row.cashout ?? row.win_amount ?? "0.00",
                Status: row.status ?? "UNKNOWN",
                created_at: row.created_at,
                FieldSize: parsedGameData.gridType ?? null,
                Result: parsedGameData.playerGrid ?? []
            };
        });
    }

    details(resp: any[]) {
        if (!resp || !resp.length) return {};
        const row = resp[0];

        let parsedGameData: any = {};
        try {
            parsedGameData = row.GameData ? JSON.parse(JSON.parse(row.GameData)) : {};
        } catch (e) {
            console.error("Failed to parse GameData:", e);
        }

        return {
            match_id: parsedGameData.matchId ?? row.ID,
            user_id: parsedGameData.bet_id ? parsedGameData.bet_id.split(":")[3] : null,
            operator_id: parsedGameData.bet_id ? parsedGameData.bet_id.split(":")[2] : null,
            created_at: row.created_at,
            bet: row.Bet ?? (parsedGameData.bet ? parsedGameData.bet.toFixed(2) : "0.00"),
            multiplier: row.X ?? (parsedGameData.currentMultiplier?.toString() ?? "1.00"),
            win_amount: row.Cashout ?? parsedGameData.bank ?? "0.00",
            result: row.Status ?? "LOSS"
        };
    }



}
