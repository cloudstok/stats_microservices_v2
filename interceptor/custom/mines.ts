import { ARespMapper } from "../abstractMapper";

export class MinesMapper extends ARespMapper {
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
            default: formattedResp = resp;
                break;
        }
        return formattedResp;
    }


    history(resp: any[]) {
        if (!Array.isArray(resp) || resp.length <= 0) return [];
        return resp.map((row: any) => {
            const maxCashoutAmount = 500000

            const gameData = JSON.parse(JSON.parse(row.game_data));
            const minesData = JSON.stringify(gameData.playerGrid);
            const minesCount = gameData.playerGrid.flat().filter((cell: any) => cell.isMine).length;

            return {
                lobbyId: row.lobby_id,
                userId: `${row.user_id.slice(0, 2)}***${row.user_id.slice(-2)}`,
                bet: row.bet_amount,
                multiplier: row.max_mult,
                cashout: Math.min((row.bet_amount * row.max_mult), maxCashoutAmount).toFixed(2),
                dateTime: row.created_at,
                minesData: minesData,
                minesCount: minesCount
            };
        });
    }

    details = (resp: any[]) => {
        if (!resp || !resp.length) return {};

        const row = resp[0];
        const maxCashoutAmount = 500000

        return {
            bet_id: row.bet_id,
            lobby_id: row.lobby_id,
            user_id: row.user_id ? `${row.user_id.slice(0, 2)}***${row.user_id.slice(-2)}` : "",
            operator_id: row.operator_id,
            bet_amount: row.bet_amount,
            max_mult: row.max_mult,
            win_amount: Math.min((row.bet_amount * row.max_mult), maxCashoutAmount).toFixed(2),
            created_at: row.created_at
        };
    };
}
