import { ARespMapper } from "../abstractMapper";

export class rapidRoulette extends ARespMapper {
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
