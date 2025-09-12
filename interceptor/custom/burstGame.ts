import { ARespMapper } from "../abstractMapper";

export class BurstGameMapper extends ARespMapper {
    constructor() {
        super();
    }
    formatter(path: string, resp: any[]) {
        if (!Array.isArray(resp) || !resp.length) return resp;

        let formattedResp;
        switch (path) {
            case "bet-details": formattedResp = this.details(resp);
                break;
            case "top-win": formattedResp = this.topWin(resp);
                break;
            default: formattedResp = resp;
                break;
        }
        return formattedResp;
    }

    mask = (str: string) => `${str[0]}***${str.slice(-1)}`;

    history(resp: any[]) {
        throw new Error("Method not implemented.");
    }

    details = (resp: any[]) => {
        return resp.reduce((acc, e) => {
            acc = {
                lobby_id: e.lobby_id,
                user_id: e.user_id ? this.mask(e.user_id) : "",
                operator_id: e.operator_id,
                bet_amount: e.bet_amount,
                max_mult: e.max_mult,
                win_amount: e.win_amount,
                created_at: e.created_at,
                status: e.status
            };
            return acc;
        }, {});
    };


    topWin = (resp: any[]) => {
        resp.forEach(e => {
            if (e.name) e.name = this.mask(e.name);
            if (e.user_id) e.user_id = this.mask(e.user_id);
        })
        return resp;
    };

}
