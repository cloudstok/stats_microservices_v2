import { ARespMapper } from "../abstractMapper";

export class RiderMapper extends ARespMapper {
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

    history(resp: any[]) {
        if (!resp || !Array.isArray(resp) || resp.length == 0) return [];
        return resp.map(e => {
            return {
                bet_amount: e.bet_amount,
                max_mult: e.max_mult,
                payout: e.status === 'WIN' ? Math.min(Number(e.bet_amount * e.max_mult), 500000).toFixed(2) : 0.00,
                match_max_mult: e.match_max_mult,
                status: e.status = Number(e.max_mult) < Number(e.match_max_mult) ? 'WIN' : 'LOSS',
                created_at: e.created_at
            };
        })
    };

    details = (resp: any[]) => {
        if (!resp) return {};
        const respData = resp[0];
        return {
            bet_amount: respData.bet_amount,
            max_mult: respData.max_mult,
            payout: respData.status === 'WIN' ? Math.min(Number(respData.bet_amount * respData.max_mult), 500000).toFixed(2) : 0.00,
            match_max_mult: respData.match_max_mult,
            status: respData.status = Number(respData.max_mult) < Number(respData.match_max_mult) ? 'WIN' : 'LOSS',
            created_at: respData.created_at
        }
    };

}