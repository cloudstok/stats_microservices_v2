import { ARespMapper } from "../abstractMapper";

export class MiniMapper extends ARespMapper {
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
        if (!resp || resp.length === 0) return [];
        const result: any[] = [];

        for (const row of resp) {
            try {
                const userBets = JSON.parse(row.userbets || "[]");
                const gameResult = JSON.parse(row.result || "{}");

                for (const bet of userBets) {
                    let chip = bet.chip;

                    let winAmount = Number(bet.winAmount) || 0;
                    const betAmount = Number(bet.betAmount) || 0;
                    winAmount = bet.status === "win" ? winAmount - betAmount : 0 - betAmount;

                    result.push({
                        lobby_id: row.lobby_id,
                        user_id: row.user_id,
                        operator_id: row.operator_id,
                        result: gameResult,
                        created_at: row.created_at,
                        chip,
                        betAmount,
                        winAmount,
                        mult: bet.mult || 0,
                        status: bet.status,
                    });
                }
            } catch (e) {
                console.warn("Failed to parse userBets or result:", e);
            }
        }

        return result;
    }

    details(resp: any[], dbName?: string) {
        if (!resp || resp.length === 0) return {};

        try {
            const row = resp[0];
            const gameResult = JSON.parse(row.result || "{}");
            const userBets = JSON.parse(row.userBets || "[]");

            const finalData: any = {
                lobby_id: row.lobby_id,
                user_id: row.user_id,
                operator_id: row.operator_id,
                total_bet_amount: row.bet_amount,
                winner: gameResult.winner,
                bet_time: row.created_at,
                result: gameResult,
            };

            userBets.forEach((bet: any, i: number) => {
                finalData[`Bet${i + 1}`] = {
                    chip: bet.chip,
                    bet_amount: bet.betAmount,
                    win_amount: bet.winAmount,
                    multiplier: bet.status === "win" ? bet.mult : 0,
                    status: bet.status,
                };
            });

            return finalData;
        } catch (e) {
            console.warn("Failed to parse bet-details data:", e);
            return {};
        }
    }
}
// mapChip(chip: any, dbName?: string, gameResult?: any) {
//     switch (dbName) {
//         case "cricket_war":
//             return chip == 1 ? "BATSMAN" : "BOWLER";
//         case "football_studio":
//             return chip == 1 ? "HOME" : "AWAY";
//         case "teen_patti_muflis":
//             return chip == 1 ? "Player A" : "Player B";
//         case "andar_bahar":
//             return chip == 1 ? "Andar" : "Bahar";
//         case "bacarrat":
//             return chip == 1 ? "Player" : "Banker";
//         case "superover":
//             return chip == "1" ? gameResult?.teamA || "Team A" : gameResult?.teamB || "Team B";
//         default:
//             return chip;
//     }
// }
// getWinnerName(winner: number, dbName?: string) {
//     switch (dbName) {
//         case "cricket_war":
//             return winner == 1 ? "BATSMAN" : winner == 2 ? "BOWLER" : "TIE";
//         case "football_studio":
//             return winner == 1 ? "HOME" : winner == 2 ? "AWAY" : "DRAW";
//         case "teen_patti_muflis":
//             return winner == 1 ? "Player A" : "Player B";
//         case "andar_bahar_mini":
//             return winner == 1 ? "Andar" : "Bahar";
//         case "bacarrat_mini":
//             return winner == 1 ? "Player" : winner == 2 ? "Banker" : "TIE";
//         default:
//             return winner;
//     }
// }