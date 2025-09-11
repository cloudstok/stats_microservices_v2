import { ARespMapper } from "../abstractMapper";

export class TeenPattiMapper extends ARespMapper {
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
        const result: any[] = [];

        for (const entry of resp) {
            const betValues = entry.bet_values || {};
            const roundResult = entry.round_result || {};
            const roundId = entry.round_id;
            const winnerTeam = roundResult.winner;

            for (const [teamKey, stake] of Object.entries(betValues)) {
                if ((stake as number) > 0) {
                    let odds = 1.98;
                    let profit = 0;
                    let loss = stake as number;

                    if (teamKey === winnerTeam) {
                        profit = +(Number(stake) * odds - Number(stake)).toFixed(2);
                        loss = 0;
                    }

                    result.push({
                        round_id: roundId,
                        bet_on: teamKey,
                        odds,
                        stake,
                        profit,
                        loss
                    });
                }
            }
        }

        return result;
    }

    details(resp: any[]) {
        const entry = resp[0] || {};
        if (!Object.keys(entry).length) return {};

        const roundResult = entry.round_result || {};
        const winner = roundResult?.winner || "UNKNOWN";

        if (!roundResult.handA) roundResult.handA = {};
        if (!roundResult.handB) roundResult.handB = {};

        roundResult.playerA?.forEach((card: any, idx: number) => {
            roundResult.handA[`card_${idx + 1}`] = card.fId;
        });

        roundResult.playerB?.forEach((card: any, idx: number) => {
            roundResult.handB[`card_${idx + 1}`] = card.fId;
        });

        delete roundResult.roundId;
        delete roundResult.playerA;
        delete roundResult.playerB;

        const finalData: any = {
            bet_time: entry.created_at,
            lobby_id: entry.round_id,
            user_id: entry.user_id,
            operator_id: entry.operator_id,
            total_bet_amount: entry.bet_amt,
            roundResult,
        };

        // Add Bet1, Bet2 only if amount > 0
        let betIndex = 1;
        for (const [player, amount] of Object.entries(entry.bet_values || {})) {
            if (amount && (amount as number) > 0) {
                finalData[`Bet${betIndex}`] = {
                    player,
                    bet_amount: amount,
                    status: player === winner ? "WIN" : "LOSS",
                    win_amount: player === winner ? entry.win_amt : 0
                };
                betIndex++;
            }
        }

        return finalData;
    }
}