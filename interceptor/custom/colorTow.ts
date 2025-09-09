import { ARespMapper } from "../abstractMapper";

export class color_2 extends ARespMapper {
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

    history = (resp: any[]) => resp.map(e => {
        return {
            lobby_id: e.lobby_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            bet_amount: e.bet_amount,
            profit: e.win_amount - e.bet_amount,
            max_mult: e.max_mult,
            created_at: e.created_at,
        }
    });


    details(resp: any[]) {
        const data: any = {
            lobby_id: resp[0].lobby_id,
            user_id: resp[0].user_id,
            operator_id: resp[0].operator_id,
            bet_amount: resp[0].bet_amount,
            win_amount: resp[0].win_amount,
            max_mult: resp[0].max_mult,
            created_at: resp[0].created_at,
        };
        return data;
    }


}
