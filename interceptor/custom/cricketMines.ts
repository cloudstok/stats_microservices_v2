import { ARespMapper } from "../abstractMapper";

export class CricketMinesMapper extends ARespMapper {
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
        if (!Array.isArray(resp) || resp.length <= 0) return [];

        const maxCashoutAmount = 500000;

        return resp.map(e => {
            let playerGrid: any[] = [];
            let revealedCells: any[] = [];
            let wicketCount = 0;
            let gridSize = 0;

            try {
                const parsedData = JSON.parse(JSON.parse(e.game_data));
                playerGrid = parsedData.playerGrid || [];
                revealedCells = parsedData.revealedCells || [];
                wicketCount = playerGrid.flat().filter((cell: any) => cell.isMine).length;
                gridSize = playerGrid.length;
            } catch (err) {
                console.error("Error parsing game_data:", err);
            }

            return {
                lobbyId: e.lobby_id,
                userId: e.user_id ? `${e.user_id.slice(0, 2)}***${e.user_id.slice(-2)}` : "",
                bet: e.bet_amount,
                multiplier: e.max_mult,
                cashout: Math.min(Number(e.bet_amount) * Number(e.max_mult), maxCashoutAmount).toFixed(2),
                created_at: e.created_at,
                status: e.status,
                gridSize: gridSize,
                wicketCount: wicketCount,
                revealedCells: revealedCells,
                minesData: JSON.stringify(playerGrid)
            };
        });
    };

    details = (resp: any[]) => {
        if (!resp || !resp.length) return {};

        const e = resp[0];
        const maxCashoutAmount = 500000;

        let playerGrid: any[] = [];
        let revealedCells: any[] = [];
        let wicketCount = 0;
        let gridSize = 0;

        try {
            const parsedData = JSON.parse(JSON.parse(e.game_data));
            playerGrid = parsedData.playerGrid || [];
            revealedCells = parsedData.revealedCells || [];
            wicketCount = playerGrid.flat().filter((cell: any) => cell.isMine).length;
            gridSize = playerGrid.length;
        } catch (err) {
            console.error("Error parsing game_data:", err);
        }

        return {
            lobby_id: e.lobby_id,
            user_id: e.user_id,
            bet_amount: e.bet_amount,
            max_mult: e.max_mult,
            win_amount: Math.min(Number(e.bet_amount) * Number(e.max_mult), maxCashoutAmount).toFixed(2),
            created_at: e.created_at,
            status: e.status
        };
    };
}
