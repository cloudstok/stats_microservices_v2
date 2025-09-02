import type { TGameDbQueries } from "../interfaces/db";

export class QueryBuilder {

    private static instance: QueryBuilder;
    queries: TGameDbQueries;

    constructor() {
        this.queries = {};
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new QueryBuilder();
        }
        return this.instance;
    }

    setGamesQueries(queries: TGameDbQueries) {
        this.queries = queries;
        return;
    }

    getQueryByAppRoute(cat: string, app: string, path: string): string {
        return this.queries[cat][app][path] as string;
    }

    getCustomQuery(fields: string[], args: string[], table: string = "settlement", orderBy?: string, order?: string, limit?: number, offset?: number) {
        return `select ${fields.join(", ")} from ${table}
         where ${args.map(e => `${e} = ?`).join(" and ")}
         ${orderBy && order ? `order by ${orderBy} ${order}` : ``}
         ${limit ? `limit ${limit}` : ``}
         ${offset ? `offset ${offset}` : ``}`;
    }

    getTopWinQuery(freq: string, aap: string, unit: TimeUnit, limit: number = 20): string {
        let baseQuery = `
        SELECT 
            st.name, st.lobby_id, st.avatar, st.bet_amount, st.win_amount,
            st.max_mult as settled_max_mult, st.created_at, st.status,
            (select rs.max_mult from round_stats as rs where rs.lobby_id = st.lobby_id) as round_max_mult
        FROM settlement as st WHERE st.status = 'cashout'`;

        if (aap == 'pilot') {
            baseQuery = `
        SELECT 
            st.name, st.lobby_id, st.avatar, st.bet_amount, 
            st.max_mult as settled_max_mult, st.part_mult, st.is_part_co, st.created_at,
            st.status, (select rs.max_mult from round_stats as rs where rs.lobby_id = st.lobby_id) as round_max_mult
        FROM settlement as st WHERE st.status = 'cashout'`;
        }

        const orderClauses = {
            HW: `ORDER BY st.max_mult DESC LIMIT ${limit}`,
            BW: `ORDER BY st.win_amount DESC LIMIT ${limit}`,
            MW: `ORDER BY max_mult DESC LIMIT ${limit}`
        };

        const dateConditions = {
            YEAR: "st.created_at > curDate() - interval 1 year",
            MONTH: "st.created_at > curDate() - interval 1 month",
            WEEK: "st.created_at > curDate() - interval 1 week",
            DAY: "st.created_at > curDate() - interval 1 day"
        };

        const mwDateConditions = {
            YEAR: "created_at > curDate() - interval 1 year",
            MONTH: "created_at > curDate() - interval 1 month",
            WEEK: "created_at > curDate() - interval 1 week",
            DAY: "created_at > curDate() - interval 1 day"
        };

        if (["HW", "BW"].includes(freq)) {
            return `${baseQuery} AND ${dateConditions[unit]} ${orderClauses[freq as TOrder]}`;
        } else if (freq === "MW") {
            return `SELECT * FROM round_stats WHERE ${mwDateConditions[unit]} ${orderClauses.MW}`;
        } else return "";
    };
}