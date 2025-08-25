import { ARespMapper } from "../abstractMapper";

export class RespMapper extends ARespMapper {

    constructor() {
        super();
    }
    history = (resp: any[]) => resp.map(e => {
        return {
            bet_id: e.bet_id,
            lobby_id: e.lobby_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            hash: e.hash,
            auto_cashout: e.auto_cashout,
            max_mult: e.max_mult,
            win_amount: e.win_amount,
            status: e.status,
            created_at: e.created_at
        }
    })
    details = (resp: any[]) => resp.map(e => {
        return {
            bet_id: e.bet_id,
            lobby_id: e.lobby_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            hash: e.hash,
            auto_cashout: e.auto_cashout,
            max_mult: e.max_mult,
            win_amount: e.win_amount,
            status: e.status,
            created_at: e.created_at
        }
    })
}