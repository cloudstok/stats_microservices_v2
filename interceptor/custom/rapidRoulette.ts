import { ARespMapper } from "../abstractMapper";

export class RapidRouletteMapper extends ARespMapper {
    rangeChips: { [key: number]: string } = {
        13: '1-2-3-4-5-6',
        14: '4-5-6-7-8-9',
        15: '7-8-9-10-11-12',
        16: '0-2-4-6-8-10',
        17: '2-4-6-8-10-12',
        18: '1-3-5-7-9-11',
        19: '1-3-5-7-9-11',
        20: '3-6-9-12',
        21: '2-5-8-11',
        22: '1-4-7-10'
    };
    constructor() {
        super();
    }

    getChipDat(chip: number[]) {
        if (chip.length == 1) {
            if (this.rangeChips[chip[0]]) {
                const data = this.rangeChips[chip[0]];
                if (data.includes('-')) return data.split('-');
                else return data
            }
        };
        return chip;
    }

    determineColor(num: number) {
        const reds = [1, 3, 5, 7, 9, 11];
        const blacks = [2, 4, 6, 8, 10, 12];
        if (reds.includes(num)) return "red";
        else if (blacks.includes(num)) return "black"
        return "";
    };

    chipType(numbers: number[]) {
        const mapping: { [key: number]: string } = {
            13: "1 To 6",
            14: "4 To 9",
            15: "7 To 12",
            16: 'Even',
            17: 'Black',
            18: 'Red',
            19: 'Odd',
            20: 'Column 1',
            21: 'Column 2',
            22: 'Column 3',
        };

        if (!Array.isArray(numbers)) {
            return "Invalid Input";
        }

        if (numbers.length === 1) {
            return mapping[numbers[0]] || "Single Number";
        } else if (numbers.length === 2) {
            return "Two Combo";
        } else if (numbers.length === 3) {
            return "Three Combo";
        } else if (numbers.length === 4) {
            return "Four Combo";
        } else {
            return "Invalid Combo";
        }
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
                const bets = JSON.parse(row.userbets || "[]");
                for (const bet of bets) {
                    result.push({
                        user_id: row.user_id,
                        bet_amount: row.bet_amount,
                        result: parseInt(row.result),
                        win_amount: row.win_amount,
                        color: this.determineColor(parseInt(row.result)),
                        created_at: row.created_at,
                        ...bet,
                        type: this.chipType(bet.chip),
                        chip: this.chipType(bet.chip)
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
        const finalData: any = {};
        const bets = JSON.parse(rowData.userBets);
        bets.map((bet: any, index: number) => {
            finalData[`bet_${index + 1}`] = {
                user_id: rowData.user_id,
                bet_amount: rowData.bet_amount,
                result: parseInt(rowData.result),
                win_amount: rowData.win_amount,
                color: this.determineColor(parseInt(rowData.result)),
                time: rowData.created_at,
                ...bet,
                chip: JSON.stringify(bet.chip),
                type: this.chipType(bet.chip)
            }
        });
        return finalData;
    };
};