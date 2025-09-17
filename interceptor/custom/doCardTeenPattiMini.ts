import { ARespMapper } from "../abstractMapper";

export class DoCardTeenPattiMapper extends ARespMapper {
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
                const winner = gameResult["winner"] || [];
                const winnerCards = gameResult[winner];
                for (const bet of userBets) {
                    const stake = parseFloat(bet.betAmount);
                    const odds = parseFloat(bet.mult);

                    result.push({
                        stake,
                        odds,
                        'p/l': bet.status === 'win' ? bet.winAmount - bet.betAmount : 0 - stake,
                        beton: bet.chip,
                        round_id: row.lobby_id,
                        winnerCards,
                    });
                }
            } catch (e) {
                console.warn('Failed to parse userBets:', e);
            }
        }

        return result;
    }

    details(resp: any[]) {
        if (!resp || !Array.isArray(resp) || resp.length === 0) return {};

        const bets = resp[0]; // Take first record only (bet detail = single round)
        const roundResult = JSON.parse(bets.result);
        const userBets = JSON.parse(bets.userBets);

        const rankMap: Record<string, string> = {
            A: 'Ace', K: 'King', Q: 'Queen', J: 'Jack',
            '10': '10', '9': '9', '8': '8', '7': '7', '6': '6',
            '5': '5', '4': '4', '3': '3', '2': '2'
        };
        const suitMap: Record<string, string> = {
            S: 'Spades ♠', H: 'Hearts ♥', D: 'Diamonds ♦', C: 'Clubs ♣'
        };

        const winn = roundResult["winner"];
        const cards: string[] = roundResult[winn];

        const readableCards = cards.map((card: string) => {
            const [rankCode = '', suitCode = ''] = card.split('-');
            return `${rankMap[rankCode] || rankCode} of ${suitMap[suitCode] || suitCode}`;
        });

        const finalData: any = {
            lobby_id: bets.lobby_id,
            user_id: bets.user_id,
            operator_id: bets.operator_id,
            total_bet_amount: parseFloat(bets.bet_amount).toFixed(2),
            result_cards: readableCards,
            bet_time: bets.created_at,
            handA: roundResult["1"] ? roundResult["1"].map((c: string) => c.replace("-", "")) : [],
            handB: roundResult["2"] ? roundResult["2"].map((c: string) => c.replace("-", "")) : []
        };

        // Map winner properly
        let winner = '';
        if (roundResult.winner === 1) winner = 'PlayerA';
        else if (roundResult.winner === 2) winner = 'PlayerB';
        else if (roundResult.winner === 3) winner = 'Tie';
        finalData['winner'] = winner;

        // Add bets
        userBets.forEach((e: any, i: number) => {
            let mappedChip = '';
            if (e.chip == 1) mappedChip = 'PlayerA';
            else if (e.chip == 2) mappedChip = 'PlayerB';
            else if (e.chip == 3) mappedChip = 'Tie';

            finalData[`Bet${i + 1}`] = {
                chip: mappedChip,
                bet_amount: e.betAmount,
                win_amount: e.winAmount,
                multiplier: e.status === 'win' ? e.mult : 0,
                status: e.status
            };
        });

        return finalData;
    }

}
