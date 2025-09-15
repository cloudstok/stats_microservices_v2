import { ARespMapper } from "../abstractMapper";

export class MiniRouletteMapper extends ARespMapper {
    red = [1, 3, 5, 8, 10, 12];
    indexMap: { [key: number]: string } = {
        13: '1-6',
        14: 'Even',
        15: 'Black',
        16: 'Red',
        17: 'Odd',
        18: '7-12'
    };

    constructor() {
        super();
    };

    formatter(path: string, resp: any[], limit: number) {
        let formattedResp;
        switch (path) {
            case "bet-history":
                formattedResp = this.history(resp, limit);
                break;
            case "bet-details":
                formattedResp = this.details(resp);
                break;
            default:
                formattedResp = resp;
                break;
        }
        return formattedResp;
    };

    history = (resp: any[], limit: number) => {
        if (resp.length <= 0) return []
        const result: any[] = [];
        for (const row of resp) {
            try {
                const color: string = this.red.includes(row.winning_number) ? "red" : "black";
                const bets = row.bet_data;
                for (const bet of bets) {
                    result.push({
                        match_id: row.match_id,
                        user_id: row.user_id,
                        operator_id: row.operator_id,
                        numbers: bet.numbers.split('-').length == 1 ? (this.indexMap[bet.numbers] ? [this.indexMap[bet.numbers]] : [bet.numbers]) : bet.numbers.split("-"),
                        type: bet.type,
                        color,
                        status: bet.status,
                        winning_number: row.winning_number,
                        win_mult: bet.winMult ?? 0,
                        win_amount: bet.winAmount ?? 0,
                        bet_amount: bet.amount,
                        created_at: row.created_at
                    });
                };
            } catch (e) {
                console.warn('Failed to parse userBets:', e);
            }
        };
        return result.slice(0, limit);
    };

    details = (resp: any[]) => {
        if (!resp || resp.length == 0) return {};
        const rowData = resp[0];
        const finalData: any = {
            match_id: rowData.match_id,
            user_id: rowData.user_id,
            operator_id: rowData.operator_id,
            time: rowData.created_at,
            color: this.red.includes(rowData.winning_number) ? "red" : "black",
            winning_number: rowData.winning_number,
            total_bet_amount: rowData.bet_amount,
            total_win_amount: rowData.win_amount,
            win_mult: rowData.max_mult,
            created_at: rowData.created_at
        };
        const bets = rowData.bet_data;
        bets.map((bet: any, index: number) => {
            finalData[`bet_${index + 1}`] = {
                ...bet
            };
        });
        return finalData;
    };
};