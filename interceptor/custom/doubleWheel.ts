import { ARespMapper } from "../abstractMapper";

export class DoubleWheelGameMapper extends ARespMapper {
    constructor() {
        super();
    }

    formatter(path: string, resp: any[]) {
        let formattedResp;
        switch (path) {
            case "bet-history":
                formattedResp = this.history(resp);
                break;
            case "top-win":
                formattedResp = this.topWin(resp);
                break;
            case "bet-details":
                formattedResp = this.details(resp);
                break;
            default:
                formattedResp = resp;
                break;
        }
        return formattedResp;
    }

    history(resp: any[]) {
        if (!Array.isArray(resp) || !resp.length) return [];
        return resp.map(row => ({
            match_id: row.match_id,
            user_id: row.user_id,
            operator_id: row.operator_id,
            bet_amount: Number(row.bet_amount),
            winning_bet: row.winning_bet,
            win_amount: Number(row.win_amount),
            max_mult: Number(row.max_mult),
            created_at: row.created_at,
        }));
    }

    topWin(resp: any[]) {
        if (!Array.isArray(resp) || !resp.length) return [];
        return resp.map(row => ({
            match_id: row.match_id,
            user_id: row.user_id,
            operator_id: row.operator_id,
            bet_amount: Number(row.bet_amount),
            winning_bet: row.winning_bet,
            win_amount: Number(row.win_amount),
            max_mult: Number(row.max_mult),
            created_at: row.created_at,
        }));
    }

    details(resp: any) {
        if (!Array.isArray(resp) || !resp.length) return {}
        resp = resp[0];
        const bets = (resp.betdata || "").split(",");
        const max_mult = Number(resp.max_mult);
        const betDetails: Record<string, any> = {};

        bets.forEach((bet: string, index: number) => {
            if (!bet) return;
            const [chip, amount] = bet.split("-");
            betDetails[`bet${index + 1}`] = {
                chip: chip || "",
                amount: amount || "",
                status: Number(chip) === max_mult ? "win" : "lose"
            };
        });

        return {
            match_id: resp.match_id,
            user_id: resp.user_id,
            operator_id: resp.operator_id,
            total_bet_amount: String(resp.bet_amount),
            winning_bet: resp.winning_bet,
            win_amount: String(resp.win_amount),
            created_at: resp.created_at,
            win_mult: String(resp.max_mult),
            ...betDetails
        }
    }

}
