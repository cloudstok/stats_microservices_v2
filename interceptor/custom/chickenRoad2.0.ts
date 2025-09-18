import { ARespMapper } from "../abstractMapper";

export class ChickenRoadMapper extends ARespMapper {
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

    history = (resp: any[]) => {
        if (!Array.isArray(resp)) return [];

        return resp;
    };

    details = (resp: any[]) => {
        if (!resp || resp.length === 0) return {};

        let item = resp[0];
        let gameData: any = {};

        try {
            let parsed = JSON.parse(item.game_data || "{}");
            gameData = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
        } catch (e) {
            console.error("Error parsing game_data:", e);
            gameData = {};
        }


        return {
            userId: item.user_id,
            matchId: item.match_id,
            operatorId: item.operator_id,
            betAmount: parseFloat(item.bet_amount),
            maxMultiplier: parseFloat(item.max_mult),
            winAmount: parseFloat(item.win_amount),
            status: item.status,
            createdAt: item.created_at,
            category: gameData.cat || "",
            revealedCellCount: gameData.revealedCellCount || 0
        };
    };

}
