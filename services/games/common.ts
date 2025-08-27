import type { PoolConnection } from "mysql2/promise";
import type { IServiceArgs, IFetchDataArgs } from "../../interfaces/service";
import { ABaseService } from "../abstractBaseService";

export class BaseCrashService extends ABaseService {
    constructor() {
        super();
    }

    async fetch({ category, app, path, user_id, operator_id, limit, lobby_id }: IServiceArgs): Promise<any> {
        console.log({ category, app, path });
        const query = this.queries.getQueryByAppRoute(category, app, path);
        const pool = await this.getGameDbPool(app);

        let con: PoolConnection | null = null;
        try {
            con = await pool.getConnection();
            console.log({ query });
            const data = await this.fetchData(con, query, { user_id, operator_id, lobby_id, limit });
            return data;
        } catch (err: any) {
            console.error("fetch error:", err.message);
            throw err;
        } finally {
            if (con) {
                con.release();
                console.log("connection released successfully");
            }
        }
    }

    async fetchData(con: PoolConnection, query: string, args: IFetchDataArgs): Promise<any> {
        const { user_id, operator_id, lobby_id, limit } = args;
        const arr: (string | number)[] = [user_id, operator_id];

        if (lobby_id) arr.push(lobby_id);
        else arr.push(limit || 10)

        const [rows] = await con.query(query, arr);
        return rows;
    }
}
