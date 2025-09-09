import type { PoolConnection } from "mysql2/promise"
import { dbInstance } from "../../db/dbInstance"
import { globalQueryBuilder, type DbConnect } from "../../db/dbConnect"
import type { QueryBuilder } from "../../utilities/queryBuilder";

export class UserService {
    protected db: DbConnect;
    protected queryBuilder: QueryBuilder;
    constructor() {
        this.db = dbInstance;
        this.queryBuilder = globalQueryBuilder
    }
    async findOne(userId: string) {
        let pool = this.db.getPool();
        let conn: PoolConnection | null = null;
        try {
            const query = this.queryBuilder.getCustomQuery("users", [], ["user_id"])
            if (!query) throw new Error("invalid query")
            conn = await pool.getConnection();
            const [data]: any = await conn.query(query, [userId])
            return data[0];
        } catch (error: any) {
            console.error("error occured:", error.message);
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }
    async findByName(name: string) {
        let pool = this.db.getPool();
        let conn: PoolConnection | null = null;
        try {
            const query = this.queryBuilder.getCustomQuery("users", [], ["name"])
            if (!query) throw new Error("invalid query")
            conn = await pool.getConnection();
            const [data]: any = await conn.query(query, [name])
            return data[0];
        } catch (error: any) {
            console.error("error occured:", error.message);
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }
    async create({ name, userId, password, role }: { [key: string]: string | number }) {
        let pool = this.db.getPool();
        let conn: PoolConnection | null = null;
        try {
            const query = this.queryBuilder.getInsertQuery("users", ["name", "user_id", "password", "role"])
            if (!query) throw new Error("invalid query")
            conn = await pool.getConnection();
            const [data] = await conn.query(query, [name, userId, password, role])
            return data;
        } catch (error: any) {
            console.error("error occured:", error.message);
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }
}

export const userService = new UserService();