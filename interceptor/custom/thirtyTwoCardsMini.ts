import { ARespMapper } from "../abstractMapper";

export class ThirtyTwoCardsMapper extends ARespMapper {
    constructor() {
        super();
    }

    formatter(path: string, resp: any[]) {
        let formattedResp;
        console.log(resp);
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
        if (!Array.isArray(resp) || resp.length <= 0) return [];

        const result: any[] = [];

        for (const row of resp) {
            try {
                const userBets = JSON.parse(row.userbets || "[]"); // ✅ lowercase "userbets"
                const gameResult = JSON.parse(row.result || "{}");

                for (const bet of userBets) {
                    result.push({
                        lobby_id: row.lobby_id,
                        result: gameResult,
                        created_at: row.created_at,
                        chip: bet.chip,
                        cat: bet.cat,
                        betAmount: bet.betAmount,
                        winAmount: bet.winAmount,
                        mult: bet.mult,
                        status: bet.status
                    });
                }
            } catch (e) {
                console.warn("Failed to parse userbets in 32 Cards history:", e);
            }
        }

        return result;
    }


    details(resp: any[]) {
        if (!Array.isArray(resp) || resp.length <= 0) return [];

        let globalFinalData: any = {};
        resp.forEach((row: any) => {
            const roundResult = JSON.parse(row.result || "{}");
            const userBets = JSON.parse(row.userBets || "[]");

            const finalData: any = {
                lobby_id: row.lobby_id,
                user_id: row.user_id,
                operator_id: row.operator_id,
                total_bet_amount: parseFloat(row.bet_amount).toFixed(2),
                "8_player_card": roundResult?.cards?.["1"]?.[0] || null,
                "9_player_card": roundResult?.cards?.["2"]?.[0] || null,
                "10_player_card": roundResult?.cards?.["3"]?.[0] || null,
                "11_player_card": roundResult?.cards?.["4"]?.[0] || null,
                "8_player_point": roundResult?.roundWisePoints?.["1"]?.[0] || null,
                "9_player_point": roundResult?.roundWisePoints?.["2"]?.[0] || null,
                "10_player_point": roundResult?.roundWisePoints?.["3"]?.[0] || null,
                "11_player_point": roundResult?.roundWisePoints?.["4"]?.[0] || null,
                winner_player:
                    roundResult?.winner === 1
                        ? "8 player"
                        : roundResult?.winner === 2
                            ? "9 player"
                            : roundResult?.winner === 3
                                ? "10 player"
                                : "11 player",
                bet_time: row.created_at,
            };

            userBets.forEach((e: any, i: number) => {
                const chipName =
                    e.chip === 1
                        ? "8 player"
                        : e.chip === 2
                            ? "9 player"
                            : e.chip === 3
                                ? "10 player"
                                : "11 player";
                const catName = e.cat === 1 ? "Lay" : "Back";

                finalData[`Bet${i + 1}`] = {
                    chip: chipName,
                    cat: catName,
                    bet_amount: e.betAmt,
                    win_amount: e.win ? e.winAmt : 0 - e.betAmt,
                    mult: e.winMult === 0 ? e.baseMult : e.winMult,
                    status: e.win ? "win" : "loss",
                };
            });

            globalFinalData = finalData;
        });

        return globalFinalData;
    }
}
