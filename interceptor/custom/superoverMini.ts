import { ARespMapper } from "../abstractMapper";

export class SuperOverMapper extends ARespMapper {

    SUITS = ['S', 'H', 'D', 'C'];
    RANKS = ['1', '2', '3', '4', '6', '10', '13'];
    TEAMS = [
        'India', 'Australia',
        'England', 'New Zealand',
        'Pakistan', 'South Africa',
        'Sri Lanka', 'Bangladesh',
        'Afghanistan', 'West Indies',
        'Ireland', 'Zimbabwe',
        'Nepal', 'Netherlands',
        'Scotland'
    ]

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
                    result.push({
                        lobby_id: row.lobby_id,
                        result: {
                            teamA: gameResult.teamA,
                            teamB: gameResult.teamB,
                            cardsA: gameResult.cardsA,
                            cardsB: gameResult.cardsB,
                            pointsA: gameResult.pointsA,
                            pointsB: gameResult.pointsB,
                            wicketA: gameResult.wicketA,
                            wicketB: gameResult.wicketB,
                            winner: gameResult.winner,
                        },
                        created_at: row.created_at,
                        chip: bet.chip === 1 ? gameResult.teamA : gameResult.teamB,
                        betAmount: Number(bet.betAmount),
                        winAmount: Number(bet.winAmount),
                        mult: Number(bet.mult),
                        status: bet.status?.toLowerCase() || "loss",
                    });
                }
            } catch (e) {
                console.warn("Failed to parse SuperOver userBets:", e);
            }
        }
        return result;
    }


    details(resp: any[]) {
        if (!Array.isArray(resp) || resp.length === 0) return {};
        let finalData: any = {};
        try {

            const history = resp[0];
            const winResult = JSON.parse(history.result);
            const userBets = JSON.parse(history.userBets || "[]");

            // Map winner
            const TEAMS = {
                1: winResult.teamA,
                2: winResult.teamB,
            };

            finalData = {
                lobby_id: history.lobby_id,
                user_id: history.user_id,
                operator_id: history.operator_id,
                total_bet_amount: history.bet_amount,
                winner: this.TEAMS[winResult.winner],
                team_a: winResult.teamA,
                team_b: winResult.teamB,
                team_a_score: winResult.pointsA,
                team_b_score: winResult.pointsB,
                team_a_wickets: winResult.wicketA,
                team_b_wickets: winResult.wicketB,
                bet_time: new Date(history.created_at).toISOString(),
            };

            // Dynamically include bets placed by the user
            let betIndex = 1;
            for (const bet of userBets) {
                if (bet.betAmount > 0) {
                    finalData[`Bet${betIndex}`] = {
                        team: bet.chip === 1 ? winResult.teamA : winResult.teamB,
                        bet_amount: bet.betAmount,
                        status: bet.status?.toUpperCase() || "LOSS",
                        win_amount: bet.winAmount || 0,
                        multiplier: bet.mult,
                    };
                    betIndex++;
                }
            }
        } catch (error) {
            console.warn("Failed to parse SuperOver userBets:", error);
        }
        return finalData;
    }

}
