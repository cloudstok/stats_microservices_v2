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

    formatter(path: string, resp: any[]) {
        if (!Array.isArray(resp) || !resp.length) return resp;

        switch (path) {
            case "bet-history":
                return this.history(resp);
            case "bet-details":
                return this.details(resp);
            default:
                return resp;
        }
    }

    private rangeChips: Record<number, string> = {
        13: "1-2-3-4-5-6",
        14: "4-5-6-7-8-9",
        15: "7-8-9-10-11-12",
        16: "0-2-4-6-8-10", // even
        17: "2-4-6-8-10-12", // black
        18: "1-3-5-7-9-11", // red
        19: "1-3-5-7-9-11", // odd
        20: "3-6-9-12",
        21: "2-5-8-11",
        22: "1-4-7-10",
    };

    private getChipData(chip: number[] | string) {
        if (Array.isArray(chip) && chip.length === 1) {
            const range = this.rangeChips[chip[0]];
            if (range) return range.split("-");
        }
        return chip;
    }

    private determineColor(num: number): string {
        const reds = [1, 3, 5, 7, 9, 11];
        const blacks = [2, 4, 6, 8, 10, 12];
        if (reds.includes(num)) return "red";
        if (blacks.includes(num)) return "black";
        return "";
    }

    private chipType(numbers: number[] | string): string {
        const mapping: Record<number, string> = {
            13: "1 To 6",
            14: "4 To 9",
            15: "7 To 12",
            16: "Even",
            17: "Black",
            18: "Red",
            19: "Odd",
            20: "Column 1",
            21: "Column 2",
            22: "Column 3",
        };

        if (!Array.isArray(numbers)) return "Invalid Input";

        if (numbers.length === 1) {
            return mapping[numbers[0]] || "Single Number";
        }
        switch (numbers.length) {
            case 2: return "Two Combo";
            case 3: return "Three Combo";
            case 4: return "Four Combo";
            default: return "Invalid Combo";
        }
    }

    // normalize chip argument into number[]
    private normalizeChipToArray(chip: any): number[] {
        if (Array.isArray(chip)) return chip.map((v: any) => Number(v)).filter(n => !isNaN(n));
        if (typeof chip === "number") return [chip];
        if (typeof chip === "string") {
            // try JSON array string like "[13]" or comma/dash separated "13,14" / "1-2-3"
            try {
                const parsed = JSON.parse(chip);
                if (Array.isArray(parsed)) return parsed.map((v: any) => Number(v)).filter(n => !isNaN(n));
            } catch (e) { /* not a JSON array */ }
            // extract all numbers from string
            const matches = chip.match(/\d+/g);
            if (matches) return matches.map(m => Number(m)).filter(n => !isNaN(n));
        }
        return [];
    }
    history(resp: any[]) {
        const finalData: any[] = [];

        for (const row of resp) {

            let betData: any[];
            try {
                betData = typeof row.userbets === "string" ? JSON.parse(row.userbets) : row.userbets;
            } catch (err) {
                console.warn("Invalid JSON in userBets:", row.userbets);
                continue; // skip malformed row
            }
            for (const y of betData || []) {
                const chipArr = this.normalizeChipToArray(y.chip);
                const type = chipArr.length ? this.chipType(chipArr) : "Invalid Input";
                const resultNum = row.result !== undefined && row.result !== null && !isNaN(Number(row.result))
                    ? Number(row.result)
                    : NaN;
                const color = !isNaN(resultNum) ? this.determineColor(resultNum) : "";
                const finalObj = {
                    user_id: row.user_id,
                    operator_id: row.operator_id,
                    bet_amount: row.bet_amount,
                    result: isNaN(resultNum) ? null : resultNum,
                    win_amount: row.win_amount,
                    created_at: row.created_at,
                    ...y,
                    type,
                    chip: this.getChipData(y.chip),
                    color,
                };
                finalData.push(finalObj);
            }
        }

        return finalData;
    }
    // details returns first item mapped to details shape
    details(resp: any[]) {
        const row = resp && resp[0];
        if (!row) return null;

        let betData: any[] = [];
        try {
            betData = typeof row.userBets === "string" ? JSON.parse(row.userBets) : row.userBets;
        } catch (err) {
            console.warn("Invalid JSON in userBets:", row.userBets);
            betData = [];
        }

        const finalData: Record<string, any> = {};

        (betData || []).forEach((y: any, index: number) => {
            const type = this.chipType(y.chip);
            const betKey = `bet${index + 1}`;

            const finalObj: Record<string, any> = {
                user_id: row.user_id,
                bet_amount: row.bet_amount,
                result: row.result ? parseInt(row.result) : 0,
                win_amount: row.win_amount,
                color: this.determineColor(row.result ? parseInt(row.result) : 0),
                created_at: row.created_at,
                btAmt: y.btAmt,
                winAmt: y.winAmt,
                mult: y.mult,
                status: y.status,
                type
            };

            // Add chip1, chip2, ...
            if (Array.isArray(y.chip)) {
                y.chip.forEach((chipValue: any, chipIndex: number) => {
                    finalObj[`chip${chipIndex + 1}`] = chipValue;
                });
            }

            finalData[betKey] = finalObj;
        });

        return finalData;
    }

}

    getChipData(chip: number[]) {
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
                        chip: this.getChipData(bet.chip)
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

