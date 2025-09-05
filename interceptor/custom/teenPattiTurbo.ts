import { ARespMapper } from "../abstractMapper";

export class TeenPattiTurbo extends ARespMapper {
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

        if (!resp || resp.length <= 0) return [];
        return resp.map((row: any) => {
            const parsedResult = JSON.parse(row.result);
            return {
                round_id: row.round_id,
                user_id: row.user_id,
                operator_id: row.operator_id,
                bet_amount: row.bet_amount,
                mult: row.mult,
                winning_amount: row.winning_amount,
                multiplier: row.multiplier,
                status: row.status,
                hand_type: row.hand_type,
                result: parsedResult,
                created_at: row.created_at
            };
        });
    }

    details(resp: any[]) {
        if (!resp || !resp.length) return {};

        const row = resp[0]; 
        const parsedResult = JSON.parse(row.result);
        const updatedResult = parsedResult.reduce((resAcc: any, card: any, idx: number) => {
            resAcc[`card_${idx + 1}`] = `${card.suit}${card.num}`;
            return resAcc;
        }, {});

        return {
            round_id: row.round_id,
            user_id: row.user_id,
            operator_id: row.operator_id,
            bet_amount: row.bet_amount,
            mult: row.mult,
            result: updatedResult,
            hand_type: row.hand_type,
            winning_amount: row.winning_amount,
            multiplier: row.multiplier,
            status: row.status,
            created_at: row.created_at
        };
    }
}