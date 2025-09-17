import { ARespMapper } from "../abstractMapper";

export class BacarratMapper extends ARespMapper {
    constructor() {
        super();
    }

    formatter(path: string, resp: any[]) {
        let formattedResp;
        switch (path) {
            case "bet-history": formattedResp = this.history(resp);
                break;
            case "bet-details": formattedResp = this.details(resp);
                break;
            default: formattedResp = resp;
                break;
        }
        return formattedResp;
    }

    history(resp: any[]) {
        if (!resp || resp.length === 0) return [];

        return resp.map((row: any) => {
            let betResult = [];
            try {
                betResult = row.bet_result 
            } catch (err) {
                console.error("Invalid JSON in bet_result:", row.bet_result, err);
                betResult = [];
            }

            let cardResult = {};
            try {
                cardResult = row.card_result 
            } catch (err) {
                console.error("Invalid JSON in card_result:", row.card_result, err);
                cardResult = {};
            }

            let winningChoice = [];
            try {
                winningChoice = row.winning_choice ? JSON.parse(row.winning_choice) : [];
            } catch (err) {
                console.error("Invalid JSON in winning_choice:", row.winning_choice, err);
                winningChoice = [];
            }

            return {
                id: row.id,
                user_id: row.user_id,
                round_id: row.round_id,
                operator_id: row.operator_id,
                bet_result: betResult,
                card_result: cardResult,
                winning_choice: winningChoice,
                winning_amount: row.winning_amount,
                created_at: row.created_at,
            };
        });
    }

details(resp: any[]) {
    if (!resp || !resp.length) return {};
    const row = resp[0];

    // Format hand into card_1, card_2...
    const formatHand = (cards: any[]) => {
        const hand: any = {};
        cards?.forEach((card: any, idx: number) => {
            hand[`card_${idx + 1}`] = `${card.suit}${card.num}`;
        });
        return hand;
    };

        const totalBetAmount = (row.bet_result || []).reduce(
        (sum: number, bet: any) => sum + Number(bet.betAmount || 0),
        0
    );
    const totalWinAmount = (row.bet_result || []).reduce(
        (sum: number, bet: any) => sum + Number(bet.winAmt || 0),
        0
    );

    const overallStatus = totalWinAmount > 0 ? "Win" : "Loss";

    const bet_details: any = {
        user_id: row.user_id,
        operator_id: row.operator_id,
        lobby_id: row.round_id,
        created_at:row.created_at,
        total_bet_amount:totalBetAmount.toFixed(2),
        total_win_amount:totalWinAmount.toFixed(2),
        status: overallStatus,
        round_result: {
            winner: row.winning_choice ? JSON.parse(row.winning_choice)[0] : null,
            card_result: {
                bankerHand: formatHand(row.card_result?.bankerHand || []),
                playerHand: formatHand(row.card_result?.playerHand || []),
                bankersCardSum: row.card_result?.bankersCardSum,
                playersCardSum: row.card_result?.playersCardSum
            }
        }
    };


    (row.bet_result || []).forEach((bet: any, idx: number) => {
        bet_details[`bet_${idx + 1}`] = {
            chip: bet.betChoice || null,
            bet_amount: Number(bet.betAmount).toFixed(2),
            status: bet.status,
            win_amount: Number(bet.winAmt).toFixed(2),
            mult: Number(bet.mult).toFixed(2),
            profit: Number(bet.profit).toFixed(2)
        };
    });

    return bet_details;
}


}


