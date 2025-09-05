import { ARespMapper } from "../abstractMapper";

export class CoinFlip extends ARespMapper {
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
            case "lobby-details": formattedResp = this.lobbyDetails(resp);
                break;
            default: formattedResp = resp;
                break;
        }
        return formattedResp;
    }

    history = (resp: any[]) => resp.map(e => {
        return {
            bet_id: e.bet_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            bet_amount: e.bet_amount,
            user_bets: e.user_bets,
            win_amount: e.win_amount,
            win_mult: e.win_mult,
            status: e.status,
            created_at: e.created_at,
        }
    });

    prevRoundHistory = (resp: any[]) => {
        const data = {
            round_max_mult: resp[0].round_max_mult,
            bets: resp.map(e => {
                return {
                    id: e.id,
                    bet_id: e.bet_id,
                    lobby_id: e.lobby_id,
                    user_id: `${e.user_id[0]}***${e.user_id.slice(-1)}`,
                    name: `${e.name[0]}***${e.name.slice(-1)}`,
                    operator_id: e.operator_id,
                    hash: e.hash,
                    bet_amount: e.bet_amount,
                    auto_cashout: e.auto_cashout || 0,
                    avatar: e.avatar,
                    max_mult: e.max_mult || 0,
                    win_amount: e.win_amount || 0,
                    status: e.status || null,
                    created_at: e.created_at,
                    round_max_mult: e.round_max_mult || 0,
                }
            })
        }
        return data;
    }

    details(resp: any[]) {
        const data: any = {
            user_id: resp[0].user_id,
            lobby_id: resp[0].lobby_id,
            operator_id: resp[0].operator_id
        };

        resp.forEach((row, i) => {
            const betData: any = {
                bet_amount: row.bet_amount,
                auto_cashout: row.auto_cashout,
                total_max_mult: row.max_mult,
                total_cashout_amt: row.win_amount,
                status: row.win_amount > 0 ? "WIN" : "LOSS",
                time: new Date(row.created_at).toISOString(),
                is_partial_cashout: row.is_part_co === 1 ? "YES" : "NO"
            };

            if (row.is_part_co) {
                betData.prt_cash_mult = row.part_mult;
                betData.prt_cash_amt = ((row.part_mult * row.bet_amount) / 2).toFixed(2);
                betData.part_cashout_time = new Date(row.part_co_at).toISOString();
            }

            data[`bet_${i + 1}`] = betData;
        });

        return data;
    }


    lobbyDetails = (resp: any[]) => {
        const obj = resp[0]; // first row of the response

        const hashedSeed = obj.hashedSeed || obj.hashedseed; // handle both cases
        if (!hashedSeed) throw new Error("Missing hashedSeed/hashedseed in response");

        const hex = hashedSeed.slice(0, 13);
        const lobbbyObj = {
            ...obj,
            hex,
            decimal: Number(BigInt("0x" + hex)),
        };
        return lobbbyObj;
    };

}
