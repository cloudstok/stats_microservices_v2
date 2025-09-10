import { ARespMapper } from "../abstractMapper";

export class BollywoodCasinoMapper extends ARespMapper {
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
                const userBets = JSON.parse(row.userbets || "[]");
                const gameResult = JSON.parse(row.result || "{}");
                for (const bet of userBets) {
                    const stake = parseFloat(bet.betAmt);
                    const winAmount = bet.win ? parseFloat(bet.winAmt) : 0;
                    const profitLoss = bet.win ? winAmount - stake : -stake;
                    const odds = bet.winMult == 0 ? bet.baseMult : bet.winMult;

                    result.push({
                        round_id: row.lobby_id,
                        result: gameResult,
                        cat: bet.cat,
                        bet_on: bet.betOn,
                        stake: stake.toFixed(2),
                        odds: parseFloat(odds).toFixed(2),
                        profit_loss: profitLoss.toFixed(2),
                        status: bet.win ? "win" : "loss",
                        created_at: row.created_at,
                    });
                }
            } catch (e) {
                console.warn("Failed to parse BollywoodCasino userBets:", e);
            }
        }

        return result;
    }

    details(resp: any[]) {
        if (!Array.isArray(resp) || resp.length === 0) return {};

        try {
            // First record = round-level info
            const row = resp[0];
            const roundResult = JSON.parse(row.result || "{}");
            const userBets = JSON.parse(row.userBets || "[]");

            const finalData: any = {
                lobby_id: row.lobby_id,
                user_id: row.user_id,
                operator_id: row.operator_id,
                result: roundResult,
                total_bet_amount: Number(row.bet_amount).toFixed(2),
                bet_time: row.created_at,
            };

            userBets.forEach((bet: any, index: number) => {
                const odds = bet.winMult === 0 ? bet.baseMult : bet.winMult;

                finalData[`Bet${index + 1}`] = {
                    cat: bet.cat,
                    bet_on: bet.betOn,
                    bet_amount: Number(bet.betAmt).toFixed(2),
                    win_amount: Number(bet.winAmt).toFixed(2),
                    odds: Number(odds).toFixed(2),
                    status: bet.win ? "win" : "loss",
                };
            });

            return finalData;
        } catch (e) {
            console.warn("Failed to parse BollywoodCasino details:", e);
            return {};
        }
    }

}

