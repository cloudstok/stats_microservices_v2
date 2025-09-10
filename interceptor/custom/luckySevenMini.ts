import { ARespMapper } from "../abstractMapper";

export class LuckySevenMapper extends ARespMapper {
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
                    const stake = Number(bet.betAmount);
                    const odds = Number(bet.mult);

                    result.push({
                        stake,
                        odds,
                        "p/l": bet.status === "win"
                            ? bet.winAmount - bet.betAmount
                            : 0 - stake,
                        beton: bet.chip,
                        round_id: row.lobby_id,
                        result_card: gameResult.chip,
                        category: gameResult.category,
                    });
                }
            } catch (e) {
                console.warn("Failed to parse userBets:", e);
            }
        }

        return result;
    }

    details(resp: any[]) {
        if (!resp || !Array.isArray(resp) || resp.length === 0) return {};

        const userBet = resp[0];

        const roundResult = JSON.parse(userBet.result || "{}");
        const userBets = JSON.parse(userBet.userBets || "[]");

        const winner =
            roundResult.category === "H"
                ? "HIGH"
                : roundResult.category === "L"
                    ? "LOW"
                    : roundResult.category === "M"
                        ? "MID"
                        : "UNKNOWN";

        const finalData: any = {
            lobby_id: userBet.lobby_id,
            user_id: userBet.user_id,
            operator_id: userBet.operator_id,
            total_bet_amount: Number(userBet.bet_amount),
            winner,
            result_card: roundResult.chip,
            bet_time: userBet.created_at || "",
        };

        userBets.forEach((e: any, i: number) => {
            const isWin = e.status === "win" || finalData.result_card === "7";
            finalData[`Bet${i + 1}`] = {
                chip: e.chip === "L" ? "LOW" : "HIGH",
                bet_amount: Number(e.betAmount) || 0,
                win_amount: Number(e.winAmount) || 0,
                multiplier: isWin ? Number(e.mult) || 0 : 0,
                status: e.status || "loss",
            };
        });

        return finalData;
    }
}