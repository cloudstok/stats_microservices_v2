import type { PoolConnection } from "mysql2/promise";
import { QueryBuilder } from "../../utilities/queryBuilder";
import type { DbConnect } from "../../db/dbConnect";
import { dbInstance } from "../../db/dbInstance";

export class GamesDbConfigService {
    protected db: DbConnect;
    protected queryBuilder: QueryBuilder;
    constructor() {
        this.queryBuilder = QueryBuilder.getInstance();
        this.db = dbInstance;
    }

    async executeQuery(method: TMethod, table: string, args: TMethodArgs, condArgs?: TMethodArgs) {
        let pool = this.db.getPool();
        let conn: PoolConnection | null = null;
        try {
            conn = await pool.getConnection();
            let query = this.getQueryAccToMethod(method, table, args ? Object.keys(args) : [], condArgs ? Object.keys(condArgs) : []);
            let queryValues = Object.values(args);
            if (condArgs) queryValues = queryValues.concat(Object.values(condArgs))
            const [data]: any = await conn.execute(query, queryValues);
            return data;
        } catch (error: any) {
            console.error("error occured:", error.message);
        } finally {
            if (conn) conn.release()
        }
    }

    getQueryAccToMethod(method: TMethod, table: string, args: string[], condArgs: string[]) {
        let query = "";
        switch (method) {
            case "find": query = this.queryBuilder.getSelectQuery(table); break;
            case "findById": query = this.queryBuilder.getSelectQuery(table, true); break;
            case "post": query = this.queryBuilder.getInsertQuery(table, args); break;
            case "patch": query = this.queryBuilder.getUpdateQuery(table, args, condArgs); break;
            case "delete": query = this.queryBuilder.getDeleteQuery(table, condArgs); break;
            default: throw new Error("query not found");
        }
        return query;
    }

}