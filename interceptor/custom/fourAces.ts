import { ARespMapper } from "../abstractMapper";

export class FourAces extends ARespMapper {
    constructor() {
        super();
    }
    formatter(path: string, resp: any[]) {
        if (!Array.isArray(resp) || !resp.length) return resp;

        let formattedResp;
        switch (path) {
            case "bet-details": formattedResp = this.details(resp);
                break;
            default: formattedResp = resp;
                break;
        }
        return formattedResp;
    }


    history = (resp: any[]) => resp.map(e => {
        return {

        }
    });
    details(resp: any[]) {
        const e = resp[0]
        return {
            match_id: e.match_id,
            bet_amount: e.bet_amount,
            line_ranges: e.line_ranges,
            max_mult: e.max_mult,
            status: e.status,
            created_at: e.created_at,
            payout: e.bet_amount * e.max_mult
        }
    }
}






