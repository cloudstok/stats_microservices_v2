import { ARespMapper } from "../abstractMapper";

export class SevenUpDownMapper extends ARespMapper {
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
        if (!Array.isArray(resp) || resp.length <= 0) return [];

        const result: any[] = [];

        for (const row of resp) {
            try {
                const userBets = JSON.parse(row.userBets || "[]");

                for (const bet of userBets) {
                    const stake = parseFloat(bet.betAmount);
                    const win = bet.winAmount > 0 ? bet.winAmount - stake : -stake;
                    const mult =
                        bet.chip === 1 ? 1.98 :
                            bet.chip === 2 ? 1.98 :
                                12;
                    const chip_name =
                        bet.chip === 1 ? "7 Down" :
                            bet.chip === 2 ? "7 Up" :
                                "Seven";

                    result.push({
                        user_id: row.user_id,
                        operator_id: row.operator_id,
                        lobby_id: row.lobby_id,
                        chip: bet.chip,
                        betAmount: stake,
                        winAmount: win,
                        mult: mult,
                        status: bet.status,
                        chip_name: chip_name,
                    });
                }
            } catch (e) {
                console.warn("Failed to parse userBets:", e);
            }
        }

        return result;

    }

    details(resp: any[]) {
        if (!Array.isArray(resp) || resp.length <= 0) return [];
        let globalFinalData = {};
        resp.forEach((userBet: any) => {
            const roundResult = JSON.parse(userBet.result || "{}");
            const userBets = JSON.parse(userBet.userBets || "[]");

            const chipMap: Record<number, { chip_name: string; mult: number }> = {
                1: { chip_name: "7 Down", mult: 1.98 },
                2: { chip_name: "7 Up", mult: 1.98 },
                3: { chip_name: "Seven", mult: 12 },
            };

            const finalData: any = {
                lobby_id: userBet.lobby_id,
                user_id: userBet.user_id,
                operator_id: userBet.operator_id,
                total_bet_amount: parseFloat(userBet.bet_amount).toFixed(2),
                winner: chipMap[roundResult.winner]?.chip_name || "Unknown",
                bet_time: userBet.created_at,
                win_card: roundResult.card.split("-").reverse().join(""),
            };

            userBets.forEach((e: any, i: number) => {
                const { chip_name, mult } = chipMap[e.chip] || { chip_name: "Unknown", mult: 0 };

                finalData[`Bet${i + 1}`] = {
                    chip: chip_name,
                    mult,
                    bet_amount: e.betAmount,
                    win_amount: e.winAmount,
                    status: e.status,
                };
            });

            globalFinalData = finalData;
        });

        return globalFinalData;
    }
}
