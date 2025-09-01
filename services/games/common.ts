import type { PoolConnection } from "mysql2/promise";
import type { IServiceArgs, IFetchDataArgs } from "../../interfaces/service";
import { ABaseService } from "../abstractBaseService";

export class BaseCrashService extends ABaseService {
    constructor() {
        super();
    }

    async fetch({ category, app, path, user_id, operator_id, limit, lobby_id, freq, unit }: IServiceArgs): Promise<any> {

        let query = (freq && unit) ? this.queries.getTopWinQuery(freq, app, unit as TimeUnit, limit) : null;
        if (!query) query = this.queries.getQueryByAppRoute(category, app, path);

        const pool = await this.getGameDbPool(app);
        let conn: PoolConnection | null = null;
        try {
            conn = await pool.getConnection();
            const data = await this.fetchData(conn, query, { user_id, operator_id, lobby_id, limit });
            return data;
        } catch (err: any) {
            console.error("fetch error:", err.message);
            throw err;
        } finally {
            if (conn) {
                conn.release();
                console.log("connection released successfully");
            }
        }
    }

    async fetchData(conn: PoolConnection, query: string, args: IFetchDataArgs): Promise<any> {
        const { user_id, operator_id, lobby_id, limit } = args;
        let arrArgs: (string | number)[] = [];

        if (!user_id && !operator_id && lobby_id) arrArgs = [lobby_id];
        else if (lobby_id) arrArgs = [user_id, operator_id, lobby_id];
        else if (limit) arrArgs = [user_id, operator_id, limit];

        arrArgs = arrArgs.filter(e => e);

        const [rows] = await conn.query(query, arrArgs);
        return rows;
    }
}
