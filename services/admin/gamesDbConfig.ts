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

    async executeQuery(method: TMethod, table: string, args: TMethodArgs | TMethodArgs[], condArgs?: TMethodArgs) {
        const pool = this.db.getPool();
        let conn: PoolConnection | null = null;
        try {
            conn = await pool.getConnection();
            let query = "";
            let queryValues: string[] = [];

            if (Array.isArray(args) && method === "post_mult") {
                if (args.length === 0) {
                    console.warn("Attempted to multi-insert with empty args array.");
                    return [];
                }
                const argsArr = args.map(e => Object.values(e));
                const fields = Object.keys(args[0]);
                queryValues = argsArr.flat();
                query = this.queryBuilder.getMultiInsertQuery(table, fields, argsArr);
            } else {
                queryValues = Object.values(args);
                query = this.getQueryAccToMethod(method, table, args ? Object.keys(args) : [], condArgs ? Object.keys(condArgs) : []);
            }

            if (condArgs) {
                queryValues = queryValues.concat(Object.values(condArgs));
            }

            const [data]: any = await conn.execute(query, queryValues);
            return data;
        } catch (error: any) {
            console.error("error occurred:", error.message);
            throw error; // Re-throw to allow the caller to handle the error
        } finally {
            if (conn) {
                conn.release();
            }
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