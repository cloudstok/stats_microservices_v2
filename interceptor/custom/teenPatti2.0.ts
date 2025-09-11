import { ARespMapper } from "../abstractMapper";

export class TeenPatti2_0Mapper extends ARespMapper {
    constructor() {
        super();
    }

    formatter(path: string, resp: any[], id?: any) {
        let formattedResp;
        switch (path) {
            case "bet-history": formattedResp = this.history(resp, id);
                break;
            case "bet-details": formattedResp = this.details(resp);
                break;
            default: formattedResp = resp;
                break;
        }
        return formattedResp;
    }

    history(resp: any[], id?: any) {
        if (!Array.isArray(resp) || resp.length === 0) return [];
        if (id) {
            for (const row of resp) {
                let bets: any[] = [];
                console.log(resp)
                try {
                    bets = row.userbets ? JSON.parse(row.userbets) : [];
                } catch (err) {
                    console.error("Invalid JSON in userbets:", row.userbets, err);
                    bets = [];
                }

                if (!Array.isArray(bets)) bets = [bets];

                const bet = bets.find((b: any) => String(b.chip) === String(id));
                if (bet) {
                    return [{
                        created_at: row.created_at,
                        betResult: {
                            chip: bet.chip,
                            betAmount: Number(bet.betAmount || 0).toFixed(2),
                            winAmount: Number(bet.winAmount || 0).toFixed(2),
                            mult: Number(bet.mult || 0).toFixed(2),
                            status: bet.status || null
                        },
                        lobby_id: row.lobby_id,
                        roundResult: row.result ? (() => {
                            try {
                                return JSON.parse(row.result);
                            } catch {
                                return row.result;
                            }
                        })() : null
                    }];
                }
            }
        }
        return resp.flatMap((row: any) => {
            let bets: any[] = [];
            try {
                bets = row.userbets ? JSON.parse(row.userbets) : [];
            } catch (err) {
                console.error("Invalid JSON in userbets:", row.userbets, err);
                bets = [];
            }

            if (!Array.isArray(bets)) bets = [bets];

            return bets.map((bet: any) => ({
                betResult: {
                    chip: bet.chip,
                    betAmount: Number(bet.betAmount || 0).toFixed(2),
                    winAmount: Number(bet.winAmount || 0).toFixed(2),
                    mult: Number(bet.mult || 0).toFixed(2),
                    status: bet.status || null
                },
                lobby_id: row.lobby_id
            }));
        });
    }

    details(resp: any[]) {
        if (!resp || !resp.length) return {};
        const row = resp[0];
        const parsedBets = JSON.parse(row.userBets);
        const rowResult = row.result;
        const bet_details: any = {
            created_at: row.created_at,
            user_id: row.user_id,
            lobby_id: row.lobby_id,
            round_result: {
                winner: rowResult.winner,
                player_A: {
                    card_1: rowResult.playerAHand?.[0] ? rowResult.playerAHand[0].suit + rowResult.playerAHand[0].num : null,
                    card_2: rowResult.playerAHand?.[1] ? rowResult.playerAHand[1].suit + rowResult.playerAHand[1].num : null,
                    card_3: rowResult.playerAHand?.[2] ? rowResult.playerAHand[2].suit + rowResult.playerAHand[2].num : null,
                    hand_type: rowResult.playerAHandType?.handType
                },
                player_B: {
                    card_1: rowResult.playerBHand?.[0] ? rowResult.playerBHand[0].suit + rowResult.playerBHand[0].num : null,
                    card_2: rowResult.playerBHand?.[1] ? rowResult.playerBHand[1].suit + rowResult.playerBHand[1].num : null,
                    card_3: rowResult.playerBHand?.[2] ? rowResult.playerBHand[2].suit + rowResult.playerBHand[2].num : null,
                    hand_type: rowResult.playerBHandType?.handType
                }
            }
        };

        if (rowResult.bonusHand?.handType !== "no_hand_match") {
            bet_details.round_result.bonusHand = {
                card_1: rowResult.bonusHand?.winningCards?.[0] || null,
                card_2: rowResult.bonusHand?.winningCards?.[1] || null,
                card_3: rowResult.bonusHand?.winningCards?.[2] || null,
                card_4: rowResult.bonusHand?.winningCards?.[3] || null,
                card_5: rowResult.bonusHand?.winningCards?.[4] || null,
                hand_type: rowResult.bonusHand?.handType || null
            };
        }

        const chipDescriptions: Record<number, string> = {
            1: "Player A",
            2: "Player B",
            3: "Pair Plus Payout for Player A",
            4: "Pair Plus Payout for Player B",
            5: "6 Card Bonus"
        };

        parsedBets.forEach((bet: any, idx: number) => {
            const chipLabels = chipDescriptions[bet.chip] || `Unknown Chip ${bet.chip}`;
            bet_details[`bet_${idx + 1}`] = {
                chip: chipLabels,
                bet_amount: Number(bet.betAmount).toFixed(2),
                status: bet.status,
                win_amount: Number(bet.winAmount).toFixed(2),
                mult: Number(bet.mult).toFixed(2)
            };
        });

        return bet_details;
    }
}
