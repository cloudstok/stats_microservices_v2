import { ARespMapper } from "../abstractMapper";

export class CrashMapper extends ARespMapper {
    constructor() {
        super();
    }
    formatter(path: string, resp: any[]) {
        if (!resp.length) return resp;
        let formattedResp;
        switch (path) {
            case "bet-history": formattedResp = this.history(resp);
                break;
            case "bet-details": formattedResp = this.details(resp);
                break;
            case "previous-round-history": formattedResp = this.prevRoundHistory(resp);
                break;
            case "lobby-details": formattedResp = this.lobbyDetails(resp);
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
            bet_amount: e.bet_amount,
            auto_cashout: e.auto_cashout,
            max_mult: e.max_mult,
            win_amount: e.win_amount,
            status: e.status,
            created_at: e.created_at
        }
    })
    prevRoundHistory = (resp: any[]) => {
        const data = {
            round_max_mult: resp[0].round_max_mult,
            bets: resp.map(e => {
                return {
                    id: e.id,
                    bet_id: e.bet_id,
                    lobby_id: e.lobby_id,
                    name: e.name,
                    user_id: e.user_id,
                    operator_id: e.operator_id,
                    hash: e.hash,
                    bet_amount: e.bet_amount,
                    auto_cashout: e.auto_cashout,
                    avatar: e.avatar,
                    max_mult: e.max_mult,
                    win_amount: e.win_amount,
                    status: e.status,
                    created_at: e.created_at,
                    round_max_mult: e.round_max_mult,
                }
            })
        }
        return data;
    }
    details = (resp: any[]) => resp.map(e => {
        return {
            lobby_id: e.lobby_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            bet_amount: e.bet_amount,
            auto_cashout: e.auto_cashout,
            max_mult: e.max_mult,
            win_amount: e.win_amount,
            status: e.status,
            created_at: e.created_at
        }
    })
    lobbyDetails = (resp: any[]) => {
        const obj = resp[0]; // first row of the response

        const hashedSeed = obj.hashedSeed || obj.hashedseed; // handle both cases
        if (!hashedSeed) {
            throw new Error("Missing hashedSeed/hashedseed in response");
        }

        const hex = hashedSeed.slice(0, 13);

        const lobbbyObj = {
            ...obj,
            hex,
            decimal: Number(BigInt("0x" + hex)),
        };

        console.log({ lobbbyObj });
        return lobbbyObj;
    };

}
