import { ARespMapper } from "../abstractMapper";

export class HeadsAndTailsMapper extends ARespMapper {
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
            return {
                round_id: row.round_id,
                user_id: row.user_id,
                operator_id: row.operator_id,
                bet_amount: row.bet_amount,
                mult: row.mult,
                bet_on: row.bet_on,
                result: row.result,
                winning_amount: row.winning_amount,
                multiplier: row.multiplier,
                status: row.status,
                created_at: row.created_at
            };
        });
    }

    details(resp: any[]) {
        if (!resp || !Array.isArray(resp) || !resp.length) return {};

        const row = resp[0];

        return {
            round_id: row.round_id,
            user_id: row.user_id,   
            operator_id: row.operator_id,
            bet_amount: row.bet_amount,
            bet_on: row.bet_on === 1 ? 'Heads' : 'Tails',
            result: row.result === 1 ? 'Heads' : 'Tails',
            winning_amount: row.winning_amount,
            multiplier: row.multiplier,
            status: row.status,
            created_at: row.created_at
        };
    }

}
