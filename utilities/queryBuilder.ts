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

    getCustomQuery(table: string = "settlement", fields: string[], condArgs: string[], orderBy?: string, order?: string, limit?: number, offset?: number) {
        const whereClause = condArgs.map(k => `${k} = ?`).join(" and ");
        return `select ${fields.length ? fields.join(", ") : "*"} 
        from ${table} 
        ${whereClause.length ? `where ${condArgs.map(e => `${e} = ?`).join(" and ")}` : ""}
         ${orderBy && order ? `order by ${orderBy} ${order}` : ``}
         ${limit ? `limit ${limit}` : ``}
         ${offset ? `offset ${offset}` : ``}`.trim();
    }

    getSelectQuery(table: string, name?: boolean) {
        return name ? `select * from ${table} where app = ?` : `select * from ${table}`;
    }

    getInsertQuery(table: string, fields: string[]) {
        return `insert ignore into ${table} (${fields.join(", ")}) values (${fields.map(e => "?").join(", ")});`;
    }

    getUpdateQuery(table: string, updateArgs: string[], conditionArgs: string[]) {
        const setClause = updateArgs.map((k) => `${k} = ?`).join(", ");
        const whereClause = conditionArgs.map(k => `${k} = ?`).join(" and ");
        return `update ${table} set ${setClause} where ${whereClause};`;
    }

    getDeleteQuery(table: string, condArgs: string[]) {
        const whereClause = condArgs.map((k) => `${k} = ?`).join(" and ")
        return `delete from ${table} where ${whereClause}`
    }

    getTopWinQuery(freq: string, aap: string, unit: TimeUnit, limit: number = 20): string {

        const orderClauses = {
            HW: `ORDER BY st.max_mult DESC LIMIT ${limit}`,
            BW: `ORDER BY st.win_amount DESC LIMIT ${limit}`,
            MW: `ORDER BY max_mult DESC LIMIT ${limit}`
        };

        const dateConditions: Record<TimeUnit, string> = {
            YEAR: "st.created_at > curDate() - interval 1 year",
            MONTH: "st.created_at > curDate() - interval 1 month",
            WEEK: "st.created_at > curDate() - interval 1 week",
            DAY: "st.created_at > curDate() - interval 1 day",
        };

        const mwDateConditions: Record<TimeUnit, string> = {
            YEAR: "created_at > curDate() - interval 1 year",
            MONTH: "created_at > curDate() - interval 1 month",
            WEEK: "created_at > curDate() - interval 1 week",
            DAY: "created_at > curDate() - interval 1 day"
        };

        let baseQuery = "";

        switch (aap) {
            case "pilot":
            case "coin_pilot":
                baseQuery = `SELECT 
                        st.name, st.lobby_id, st.avatar, st.bet_amount, st.win_amount,
                        st.max_mult as settled_max_mult, st.part_mult, st.is_part_co, st.created_at,
                        st.status, (select rs.max_mult from round_stats as rs where rs.lobby_id = st.lobby_id) as round_max_mult
                    FROM settlement as st WHERE st.status = 'cashout'`;
                break;
            case "footballx": baseQuery = `SELECT user_id, max_mult, bet_amount, win_amount, created_at FROM settlement WHERE ${mwDateConditions[unit.toUpperCase() as TimeUnit]} ORDER BY win_amount DESC LIMIT 10`
                return baseQuery;

            default:
                baseQuery = `SELECT 
                        st.name, st.lobby_id, st.avatar, st.bet_amount, st.win_amount,
                        st.max_mult as settled_max_mult, st.created_at, st.status,
                        (select rs.max_mult from round_stats as rs where rs.lobby_id = st.lobby_id) as round_max_mult
                    FROM settlement as st WHERE st.status = 'cashout'`
                break;
        }

        if (["HW", "BW"].includes(freq)) {
            return `${baseQuery} AND ${dateConditions[unit]} ${orderClauses[freq as TOrder]}`;
        } else if (freq === "MW") {
            return `SELECT * FROM round_stats WHERE ${mwDateConditions[unit]} ${orderClauses.MW}`;
        } else return "";
    };
}