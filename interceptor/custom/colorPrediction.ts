import { ARespMapper } from "../abstractMapper";

export class ColorPredictionMapper extends ARespMapper {
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
        if (!Array.isArray(resp) || resp.length <= 0) return [];

        return resp.map((e) => {
            if (!e) return [];

            const createdAt = new Date(e.created_at);
            createdAt.setHours(createdAt.getHours() + 5);
            createdAt.setMinutes(createdAt.getMinutes() + 30);
            return {
                winning_number: e.winning_number,
                win_amount: e.win_amount,
                totalBetAmount: e.totalbetamount,
                totalCashoutAmount: e.totalcashoutamount,
                created_at: createdAt
            };
        });
    }

    details(resp: any[]) {
        if (!resp || !resp.length) return {};

        const e = resp[0];
        if (!e) return {};

        // --- Helpers ---
        const getChipValue = (chip: string) => {
            if (chip.length === 1) return chip;
            if (chip === "11") return "Green";
            if (chip === "12") return "Violet";
            if (chip === "13") return "Red";
            return chip;
        };

        const colorMap: Record<number, string> = {
            0: "rd-vl",
            1: "gr",
            2: "rd",
            3: "gr",
            4: "rd",
            5: "gr-vl",
            6: "rd",
            7: "gr",
            8: "rd",
            9: "gr"
        };

        const getWinningColor = (num: number) => {
            const color = colorMap[num];
            if (color === "rd-vl") return "Red-Violet";
            if (color === "rd") return "Red";
            if (color === "gr") return "Green";
            if (color === "gr-vl") return "Green-Violet";
            return "Unknown";
        };

        const colorChips: Record<number, string> = {
            11: "gr",
            12: "vl",
            13: "rd"
        };

        const MULTIPLIERS = {
            numberMatch: 9.6,
            colorMatch: 2.0,
            violetMatch: 4.8,
            bonusMatch: 1.6
        };

        const getPayoutMultiplier = (chip: string, winningNumber: number) => {
            const chipNum = Number(chip);
            const winningNum = Number(winningNumber);

            if (chipNum === winningNum) return MULTIPLIERS.numberMatch;

            const chipColor = colorChips[chipNum];
            const winningColor = colorMap[winningNum];
            if (!chipColor || !winningColor) return 0;

            if (winningColor === chipColor) return MULTIPLIERS.colorMatch;

            if (winningColor.split("-").includes(chipColor)) {
                return chipColor === "vl"
                    ? MULTIPLIERS.violetMatch
                    : MULTIPLIERS.bonusMatch;
            }
            return 0;
        };

        const createdAt = new Date(e.created_at);
        createdAt.setHours(createdAt.getHours() + 5);
        createdAt.setMinutes(createdAt.getMinutes() + 30);

        const colour = getWinningColor(Number(e.winning_number));
        const betData = e.bet_data ? JSON.parse(e.bet_data) : [];

        const betDetails: any = {};
        betData.forEach((b: any, i: number) => {
            const multiplier = Number(getPayoutMultiplier(b.chip, e.winning_number)).toFixed(2);
            betDetails[`bet${i + 1}`] = {
                bet_amount: b.betAmount,
                chip: getChipValue(b.chip),
                multiplier,
                win_amount:
                    Number(multiplier) > 0? Number(b.betAmount * Number(multiplier)).toFixed(2): "0.00"
            };
        });

        return {
            user_id: e.user_id ? `${e.user_id.slice(0, 2)}***${e.user_id.slice(-2)}` : "",
            operator_id: e.operator_id,
            lobby_id: e.lobby_id,
            winning_number: e.winning_number,
            colour,
            total_bet_amount: e.total_bet_amount,
            total_win_amount: e.total_win_amount? Number(e.total_win_amount).toFixed(2): "0.00",
            created_at: createdAt,
            ...betDetails
        };
    }

}

