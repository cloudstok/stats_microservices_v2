import { ARespMapper } from "../abstractMapper";

export class FlashRouletteMapper extends ARespMapper {
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
        if (!resp || resp.length <= 0) return [];

        return resp.flatMap((settlement: any) => {
            const winning_number = Number(settlement.win_pos);

            return (settlement.user_bets || []).map((bet: any) => {
                const chips = bet.chip.split("-").map((n: string) => n.trim());

                return {
                    match_id: settlement.lobby_id,
                    user_id: settlement.user_id,
                    operator_id: settlement.operator_id,
                    numbers: chips, // string array as before
                    type: this.determineType(bet.chip),
                    color: this.determineColor(chips.map(Number)),
                    status: bet.status,
                    winning_number,  // same key
                    win_mult: Number(bet.mult),
                    win_amount: Number(bet.winAmount),
                    bet_amount: Number(bet.betAmount),
                    created_at: settlement.created_at,
                };
            });
        });
    }
    details(resp: any[]) {
        if (!Array.isArray(resp) || !resp.length) return {}

        const record = resp[0];
        console.log(resp);
        const betsArray = record.user_bets || [];
        const winPos = Number(record.win_pos ?? 0);

        const betsObject: Record<string, any> = {};

        betsArray.forEach((bet: any, index: number) => {
            const chip = bet.chip?.toString() ?? "";
            const amount = bet.amount?.toString() ?? "0";
            const numbers = chip
                .split("-")
                .map((n: string) => parseInt(n))
                .filter((n: number) => !isNaN(n));

            const type = this.determineType(chip);
            const color = this.determineColor(numbers);

            const status = numbers.includes(winPos) ? "win" : "lose";

            betsObject[`bet${index + 1}`] = {
                chip,
                amount,
                type,
                color,
                status
            };
        });

        return {
            user_id: record.user_id,
            operator_id: record.operator_id,
            lobby_id: record.lobby_id,
            win_pos: winPos,
            time: record.created_at ?? "",
            ...betsObject
        }
    }



    private determineType(chip: string): string {
        const key = chip
            .split("-")
            .map((n: string) => parseInt(n))
            .sort((a, b) => a - b)
            .join("-");

        if (key === "0-2-4-6-8-10-12") return "Even";
        if (key === "1-3-5-7-9-11") return "Odd";
        if (key === "1-3-5-8-10-12") return "Red";
        if (key === "2-4-6-7-9-11") return "Black";

        const colMap: Record<string, string> = {
            "1-2-3": "Column 1",
            "4-5-6": "Column 2",
            "7-8-9": "Column 3",
            "10-11-12": "Column 4",
        };
        if (colMap[key]) return colMap[key];

        const rowMap: Record<string, string> = {
            "3-6-9-12": "Row 1",
            "2-5-8-11": "Row 2",
            "1-4-7-10": "Row 3",
        };
        if (rowMap[key]) return rowMap[key];

        const rangeMap: Record<string, string> = {
            "1-2-3-4-5-6": "Range 1–6",
            "4-5-6-7-8-9": "Range 4–9",
            "7-8-9-10-11-12": "Range 7–12",
        };
        if (rangeMap[key]) return rangeMap[key];

        const chips = chip.split("-");
        if (chips.length === 1) return "Single Number";
        if (chips.length === 2) return "Double Combo";
        if (chips.length === 4) return "Four Number Combo";

        return `Group (${key})`;
    }


    private determineColor(numbers: number[]): "red" | "black" | "white" | "" {
        const reds = [1, 3, 5, 8, 10, 12];
        const blacks = [2, 4, 6, 7, 9, 11];

        const isRed = numbers.every((n) => reds.includes(n));
        const isBlack = numbers.every((n) => blacks.includes(n));
        const isWhite = numbers.every((n) => n === 0);

        if (isRed) return "red";
        if (isBlack) return "black";
        if (isWhite) return "white";

        return "";
    }
}
