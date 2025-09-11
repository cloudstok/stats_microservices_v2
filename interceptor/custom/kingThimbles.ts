import { ARespMapper } from "../abstractMapper";

export class KingThimblesMapper extends ARespMapper {
    constructor() {
        super();
    }

    formatter(path: string, resp: any[]) {
        let formattedResp;
        switch (path) {
            case "bet-history":
                formattedResp = this.history(resp);
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
        if (!resp || resp.length <= 0) return [];
        return resp.map((row: any) => {
            const gameResult = row.result ? JSON.parse(row.result) : {};
            const stake = Number(row.bet_amount ?? 0);
            const winAmt = Number(row.win_amount ?? 0);
            const odds = Number(row.mult ?? 0);
            const status = row.status || "lose";
            const pl =
                status === "win"
                    ? (winAmt - stake)
                    : -stake;

            return {
                round_id: row.round_id,
                user_id: row.user_id,
                operator_id: row.operator_id,
                stake,
                odds,
                pl,
                betOn: Number(row.bet_on ?? 0),
                status,
                winningPos: (gameResult.result || []).join(", "),
                created_at: row.created_at
            };
        });
    }

    details(resp: any[]) {
        if (!resp || !resp.length) return {};
        const row = resp[0];
        const gameResult = row.result ? JSON.parse(row.result) : {};

        const stake = Number(row.bet_amount ?? 0);
        const winAmt = Number(row.win_amount ?? 0);
        const odds = Number(row.mult ?? 0);

        return {
            round_id: row.round_id,
            user_id: row.user_id,
            operator_id: row.operator_id,
            stake,
            odds,
            pl: row.status === "win" ? (winAmt - stake) : -stake,
            betOn: Number(row.bet_on ?? 0),
            status: row.status,
            winningPos: (gameResult.result || []).join(", "),
            created_at: row.created_at
        };
    }
}
