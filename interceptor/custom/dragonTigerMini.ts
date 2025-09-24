import { ARespMapper } from "../abstractMapper";

export class DragonTigerMapper extends ARespMapper {
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
                    const chip_name = bet.chip === 1 ? "Dragon" : bet.chip === 2 ? "Tiger" : bet.chip === 3 ? "Tie" : "Suited Tie";
                    const mult = bet.chip === 1 ? 1.98 : bet.chip === 2 ? 1.98 : bet.chip === 3 ? 11 : 50;

                    const stake = Number(bet.betAmount);
                    const profitLoss = bet.winAmount > 0 ? bet.winAmount - stake : -stake;

                    result.push({
                        user_id: row.user_id,
                        operator_id: row.operator_id,
                        round_id: row.lobby_id,
                        chip_name,
                        mult: mult.toFixed(2),
                        stake: stake.toFixed(2),
                        profit_loss: profitLoss.toFixed(2),
                        status: bet.status,
                        created_at: row.created_at,
                    });
                }
            } catch (e) {
                console.warn("Failed to parse DragonTiger userBets:", e);
            }
        }

        return result;
    }

    details(resp: any[]) {
        if (!Array.isArray(resp) || resp.length <= 0) return {};

        try {
            const userBet = resp[0];
            const roundResult = JSON.parse(userBet.result || "{}");
            const userBets = JSON.parse(userBet.userBets || userBet.userbets || "[]");
            // const roundResult = entry.round_result || {};
            const winner = roundResult?.winner || "UNKNOWN";

            if (!roundResult.handA) roundResult.handA = {};
            if (!roundResult.handB) roundResult.handB = {};

            roundResult.playerA?.forEach((card: any, idx: number) => {
                roundResult.handA[`card_${idx + 1}`] = card.fId;
            });

            roundResult.playerB?.forEach((card: any, idx: number) => {
                roundResult.handB[`card_${idx + 1}`] = card.fId;
            });

            const chipMap: Record<number, { chip_name: string }> = {
                1: { chip_name: "Dragon" },
                2: { chip_name: "Tiger" },
                3: { chip_name: "Tie" },
                4: { chip_name: "Suited Tie" },
            };

            const finalData: any = {
                lobby_id: userBet.lobby_id,
                user_id: userBet.user_id,
                operator_id: userBet.operator_id,
                total_bet_amount: Number(userBet.bet_amount) || 0,
                winner: chipMap[roundResult.winner]?.chip_name || "Unknown",
                bet_time: userBet.created_at,
                roundResult
            };

            userBets.forEach((bet: any, index: number) => {
                const { chip_name } = chipMap[bet.chip] || { chip_name: "Unknown" };
                finalData[`Bet${index + 1}`] = {
                    chip: chip_name,
                    mult: bet.mult,
                    bet_amount: Number(bet.betAmount) || 0,
                    win_amount: Number(bet.winAmount) || 0,
                    status: bet.status,
                };
            });

            return finalData;
        } catch (e) {
            console.warn("Failed to parse DragonTiger bet details:", e);
            return {};
        }
    }

}
