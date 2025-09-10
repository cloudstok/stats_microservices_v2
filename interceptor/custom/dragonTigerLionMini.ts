import { ARespMapper } from "../abstractMapper";

export class DragonTigerLionMapper extends ARespMapper {
    GAME_SETTINGS = {
        max_amt: 200000,
        min_amt: 25,
        max_co: 1000000,
        win_mult: 2.94,
        cardInfo: {
            0: { card: "A", type: "heart", fId: "H1", runs: 1 },
            1: { card: "2", type: "heart", fId: "H2", runs: 2 },
            2: { card: "3", type: "heart", fId: "H3", runs: 3 },
            3: { card: "4", type: "heart", fId: "H4", runs: 4 },
            4: { card: "5", type: "heart", fId: "H5", runs: 5 },
            5: { card: "6", type: "heart", fId: "H6", runs: 6 },
            6: { card: "7", type: "heart", fId: "H7", runs: 7 },
            7: { card: "8", type: "heart", fId: "H8", runs: 8 },
            8: { card: "9", type: "heart", fId: "H9", runs: 9 },
            9: { card: "10", type: "heart", fId: "H10", runs: 10 },
            10: { card: "J", type: "heart", fId: "H11", runs: 11 },
            11: { card: "Q", type: "heart", fId: "H12", runs: 12 },
            12: { card: "K", type: "heart", fId: "H13", runs: 13 },

            13: { card: "A", type: "clubs", fId: "C1", runs: 1 },
            14: { card: "2", type: "clubs", fId: "C2", runs: 2 },
            15: { card: "3", type: "clubs", fId: "C3", runs: 3 },
            16: { card: "4", type: "clubs", fId: "C4", runs: 4 },
            17: { card: "5", type: "clubs", fId: "C5", runs: 5 },
            18: { card: "6", type: "clubs", fId: "C6", runs: 6 },
            19: { card: "7", type: "clubs", fId: "C7", runs: 7 },
            20: { card: "8", type: "clubs", fId: "C8", runs: 8 },
            21: { card: "9", type: "clubs", fId: "C9", runs: 9 },
            22: { card: "10", type: "clubs", fId: "C10", runs: 10 },
            23: { card: "J", type: "clubs", fId: "C11", runs: 11 },
            24: { card: "Q", type: "clubs", fId: "C12", runs: 12 },
            25: { card: "K", type: "clubs", fId: "C13", runs: 13 },

            26: { card: "A", type: "diamond", fId: "D1", runs: 1 },
            27: { card: "2", type: "diamond", fId: "D2", runs: 2 },
            28: { card: "3", type: "diamond", fId: "D3", runs: 3 },
            29: { card: "4", type: "diamond", fId: "D4", runs: 4 },
            30: { card: "5", type: "diamond", fId: "D5", runs: 5 },
            31: { card: "6", type: "diamond", fId: "D6", runs: 6 },
            32: { card: "7", type: "diamond", fId: "D7", runs: 7 },
            33: { card: "8", type: "diamond", fId: "D8", runs: 8 },
            34: { card: "9", type: "diamond", fId: "D9", runs: 9 },
            35: { card: "10", type: "diamond", fId: "D10", runs: 10 },
            36: { card: "J", type: "diamond", fId: "D11", runs: 11 },
            37: { card: "Q", type: "diamond", fId: "D12", runs: 12 },
            38: { card: "K", type: "diamond", fId: "D13", runs: 13 },

            39: { card: "A", type: "spades", fId: "S1", runs: 1 },
            40: { card: "2", type: "spades", fId: "S2", runs: 2 },
            41: { card: "3", type: "spades", fId: "S3", runs: 3 },
            42: { card: "4", type: "spades", fId: "S4", runs: 4 },
            43: { card: "5", type: "spades", fId: "S5", runs: 5 },
            44: { card: "6", type: "spades", fId: "S6", runs: 6 },
            45: { card: "7", type: "spades", fId: "S7", runs: 7 },
            46: { card: "8", type: "spades", fId: "S8", runs: 8 },
            47: { card: "9", type: "spades", fId: "S9", runs: 9 },
            48: { card: "10", type: "spades", fId: "S10", runs: 10 },
            49: { card: "J", type: "spades", fId: "S11", runs: 11 },
            50: { card: "Q", type: "spades", fId: "S12", runs: 12 },
            51: { card: "K", type: "spades", fId: "S13", runs: 13 },
        }
    }
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

    history(history: any[]) {
        if (!Array.isArray(history)) return [];

        return history.flatMap((entry: any) => {
            const betValues = entry.bet_values || {};
            const roundResult = entry.round_result || {};
            const winnerTeam = roundResult.winner;

            return Object.entries(betValues)
                .filter(([_, stake]: any) => Number(stake) > 0)
                .map(([teamKey, stake]: any) => {
                    const odds = this.GAME_SETTINGS?.win_mult || 1;
                    const stakeNum = Number(stake) || 0;

                    let profit = 0;
                    let loss = stakeNum;

                    if (teamKey === winnerTeam) {
                        profit = stakeNum * (odds - 1);
                        loss = 0;
                    }

                    return {
                        round_id: entry.round_id,
                        bet_on: teamKey,
                        odds,
                        stake: stakeNum,
                        profit,
                        loss,
                        status: teamKey === winnerTeam ? "WIN" : "LOSS",
                    };
                });
        });
    }


    details(history: any) {
        if (!history) return {};

        // If it's an array, pick the first entry
        const entry = Array.isArray(history) ? history[0] : history;

        // Parse round_result safely
        let roundResult: any = {};
        try {
            roundResult = typeof entry.round_result === "string"
                ? JSON.parse(entry.round_result)
                : entry.round_result || {};
        } catch {
            roundResult = {};
        }

        const winner = roundResult?.winner || "UNKNOWN";

        const data: any = {
            lobby_id: entry.round_id || "",
            user_id: entry.user_id || "",
            operator_id: entry.operator_id || "",
            total_bet_amount: Number(entry.bet_amt) || 0,
            winner,
            DRAGON_SCORE: roundResult?.DRAGON?.runs || 0,
            TIGER_SCORE: roundResult?.TIGER?.runs || 0,
            LION_SCORE: roundResult?.LION?.runs || 0,
            bet_time: entry.created_at || null,
        };

        // Attach Bet1, Bet2, etc.
        let betIndex = 1;
        for (const [team, amount] of Object.entries(entry.bet_values || {})) {
            const stake = Number(amount) || 0;
            if (stake > 0) {
                const isWinner = team === winner;
                const odds = this.GAME_SETTINGS?.win_mult || 2;
                const win_amount = isWinner ? stake * odds : 0;

                data[`Bet${betIndex}`] = {
                    team,
                    bet_amount: stake,
                    status: isWinner ? "WIN" : "LOSS",
                    win_amount
                };
                betIndex++;
            }
        }

        return data;
    }


}
