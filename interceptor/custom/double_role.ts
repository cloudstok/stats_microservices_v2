import { ARespMapper } from "../abstractMapper";

export class Double_roll extends ARespMapper {
    constructor() {
        super();
    }
    formatter(path: string, resp: any[]) {
        if (!Array.isArray(resp) || !resp.length) return resp;

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





    history = (resp: any[]) => {
        const slotData = [
            { number: 0, color: "white" },
            { number: 11, color: "black" },
            { number: 5, color: "red" },
            { number: 10, color: "black" },
            { number: 6, color: "red" },
            { number: 9, color: "black" },
            { number: 7, color: "red" },
            { number: 8, color: "black" },
            { number: 1, color: "red" },
            { number: 14, color: "black" },
            { number: 2, color: "red" },
            { number: 13, color: "black" },
            { number: 3, color: "red" },
            { number: 12, color: "black" },
            { number: 4, color: "red" },
        ];

        // helper function to get chip from number
        const getChipFromWinningNumber = (num: number): string => {
            const color = slotData.find(e => e.number == num)?.color;
            if (color == 'red') return "0";
            else if (color == 'white') return "1";
            else return "2"                        // black chip
        };

        return resp.map(e => {
            const winningChip = getChipFromWinningNumber(e.winning_number);
            return {
                lobby_id: e.lobby_id,
                user_id: e.user_id,
                operator_id: e.operator_id,
                winning_number: e.winning_number,
                win_amount: e.win_amount,
                bet_amount: e.bet_amount,
                chip: e.chip,
                multiplier:
                    e.chip == winningChip
                        ? winningChip == "1" // white
                            ? "14.00"
                            : "2.00"
                        : "0.00",
                created_at: e.created_at,
            };
        });
    };


    details = (resp: any[]) => {
        const slotData = [
            { number: 0, color: "white" },
            { number: 11, color: "black" },
            { number: 5, color: "red" },
            { number: 10, color: "black" },
            { number: 6, color: "red" },
            { number: 9, color: "black" },
            { number: 7, color: "red" },
            { number: 8, color: "black" },
            { number: 1, color: "red" },
            { number: 14, color: "black" },
            { number: 2, color: "red" },
            { number: 13, color: "black" },
            { number: 3, color: "red" },
            { number: 12, color: "black" },
            { number: 4, color: "red" },
        ];

        // helper function to get chip from number
        const getChipFromWinningNumber = (num: number): string => {
            const color = slotData.find(e => e.number == num)?.color;
            if (color == 'red') return "0";
            else if (color == 'white') return "1";
            else return "2"                        // black chip
        };

        return resp.map(e => {
            const winningChip = getChipFromWinningNumber(e.winning_number);
            return {
                lobby_id: e.lobby_id,
                user_id: e.user_id,
                operator_id: e.operator_id,
                winning_number: e.winning_number,
                win_amount: e.win_amount,
                bet_amount: e.bet_amount,
                chip: e.chip,
                multiplier:
                    e.chip == winningChip
                        ? winningChip == "1" // white
                            ? "14.00"
                            : "2.00"
                        : "0.00",
                created_at: e.created_at,
            };
        });
    };

}






