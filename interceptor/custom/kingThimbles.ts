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
            let parsedBet: any = {};
            try {
                parsedBet = row.userbets ? JSON.parse(row.userbets) : {};
            } catch (e) {
                console.error("Failed to parse userbets:", row.userbets, e);
            }

            const gameResult = row.result ? JSON.parse(row.result) : {};
            const stake = Number(parsedBet.btAmt ?? 0);
            const winAmt = Number(parsedBet.winAmt ?? 0);
            const odds = Number(parsedBet.mult ?? 0);
            const status = parsedBet.status || "lose";
            const pl = status === "win" ? winAmt - stake : -stake;

            return {
                stake: stake.toFixed(2),
                odds: odds.toFixed(2),
                pl: pl.toFixed(2),
                betOn: parsedBet.betOn ?? null,
                round_id: row.lobby_id ?? row.round_id ?? null,
                status,
                winningPos: (gameResult.result || []).join(", ")
            };
        });
    }

    details(resp: any[]) {
        if (!resp || !resp.length) return {};
        const row = resp[0];
        const gameResult = row.result ? JSON.parse(row.result) : {};

        // Parse userBets JSON
        const userBets = row.userBets ? JSON.parse(row.userBets) : {};

        const stake = Number(userBets.btAmt ?? 0);
        const winAmt = Number(userBets.winAmt ?? 0);
        const odds = Number(userBets.mult ?? 0);
        const status = userBets.status || "lose";
        const pl = status === "win" ? (winAmt - stake) : -stake;

        return {
            round_id: row.round_id,
            lobby_id: row.lobby_id,
            user_id: row.user_id,
            operator_id: row.operator_id,
            stake: stake.toFixed(2),
            odds: odds.toFixed(2),
            pl: pl.toFixed(2),
            betOn: Number(userBets.betOn ?? 0),
            status,
            winningPos: (gameResult.result || []).join(", "),
            created_at: row.created_at
        };
    }


}
