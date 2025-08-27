import { ARespMapper } from "../abstractMapper";

export class AAAMiniMapper extends ARespMapper {
    constructor() {
        super();
    }
    history(resp: any[]) {
        if (resp.length <= 0) return []

        const result: any[] = [];
        for (const row of resp) {
            try {
                const userBets = JSON.parse(row.userBets || "[]");
                const gameResult = JSON.parse(row.result || "{}");
                const winner = gameResult.winner;
                const winnerCard = gameResult.card || '';

                for (const bet of userBets) {
                    const stake = parseFloat(bet.betAmount);
                    const win = parseFloat(bet.winAmount) - stake;
                    const odds = parseFloat(bet.mult).toFixed(2);

                    result.push({
                        stake,
                        odds,
                        'p/l': bet.status === 'win' ? (bet.winAmount - bet.betAmount).toFixed(2) : 0 - stake,
                        beton: bet.chip === 1 ? 'Amar' : bet.chip === 2 ? 'Akbar' : 'Anthony',
                        round_id: row.lobby_id,
                        winningCard: winnerCard,
                    });
                }
            } catch (e) {
                console.warn('Failed to parse userBets:', e);
            }
        }

        return result;

    }
    details(resp: any) {
        if (!resp || !Array.isArray(resp) || !resp.length) return [];

        let globalFinalData: any[] = [];
        resp.forEach((userBet: any) => {
            const roundResult = JSON.parse(userBet.result);
            const userBets = JSON.parse(userBet.userBets);

            const rankMap: Record<string, string> = {
                A: 'Ace', K: 'King', Q: 'Queen', J: 'Jack',
                '10': '10', '9': '9', '8': '8', '7': '7', '6': '6',
                '5': '5', '4': '4', '3': '3', '2': '2'
            };
            const suitMap: Record<string, string> = {
                S: 'Spades ♠', H: 'Hearts ♥', D: 'Diamonds ♦', C: 'Clubs ♣'
            };
            const [rankCode = '', suitCode = ''] = roundResult?.card?.split('-') || [];
            const resultCardFullName = `${rankMap[rankCode] || rankCode} of ${suitMap[suitCode] || suitCode}`;

            const finalData: any = {
                lobby_id: userBet.lobby_id,
                user_id: userBet.user_id,
                operator_id: userBet.operator_id,
                total_bet_amount: parseFloat(userBet.bet_amount).toFixed(2),
                result_card: resultCardFullName,
                bet_time: userBet.created_at,

            };

            // Determine winner
            let winner = '';
            if (roundResult.winner === 1) {
                winner = 'Amar';
            } else if (roundResult.winner === 2) {
                winner = 'Akbar';
            } else if (roundResult.winner === 3) {
                winner = 'Anthony';
            }
            finalData['winner'] = winner;

            // Bet mapping with chip conversion
            userBets.forEach((e: any, i: number) => {
                let mappedChip = '';
                if (e.chip == 1) mappedChip = 'Amar';
                else if (e.chip == 2) mappedChip = 'Akbar';
                else if (e.chip == 3) mappedChip = 'Anthony';


                finalData[`Bet${i + 1}`] = {
                    chip: mappedChip,
                    bet_amount: e.betAmount,
                    win_amount: e.winAmount,
                    multiplier: e.status === 'win' ? e.mult : 0,
                    status: e.status
                };
            });

            globalFinalData = [...globalFinalData, finalData]
        });
        return globalFinalData;
    }
}