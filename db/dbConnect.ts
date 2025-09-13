import { sleep } from "bun";
import { createPool, type Pool, type PoolConnection, type PoolOptions } from "mysql2/promise";
import type { ILoadDBConfigData, TGameDbQueries } from "../interfaces/db";
import { QueryBuilder } from "../utilities/queryBuilder";
import { configMaster, gameDbConfig, gameDbQueries, users } from "./tables";
import { createLogger } from "../utilities/logger";
import { decryption } from "../utilities/crypto";

const dbLogger = createLogger("DB", "plain");

export let DB_GAMES_QUERIES: TGameDbQueries = {};
export let DB_GAMES_LIST: Record<string, string[]> = {};
export let GAMES_CATEGORIES: Record<string, string[]> = {};

export class GamesDbConnect {
    private static instance: GamesDbConnect;
    pools: Record<string, Pool>;
    gamesDbConfig: Record<string, PoolOptions>;
    retryCount = 0;
    maxRetryCount = 5;

    constructor() {
        this.pools = {};
        this.gamesDbConfig = {};
    }

    static getInstance() {
        if (!this.instance) this.instance = new GamesDbConnect();
        return this.instance;
    }

    async createDbPool(config: PoolOptions, dbName: string) {
        try {
            this.pools[dbName] = createPool(config);
            if (!this.pools[dbName]) { throw new Error(`unable to connect for ${dbName}`); }
            else dbLogger.info(`DB Pool Created For ${dbName} at ${new Date().toISOString()}`)

            return;
        } catch (error: any) {
            console.error("error occured", error.message, " retry count number",);
            this.retryCount += 1;
            if (this.retryCount > this.maxRetryCount) process.exit(1);
            else {
                await sleep(1000);
                this.createDbPool(config, dbName);
            }
        }
        this.retryCount = 0;
        return;
    }

    async initGamesDbPools(gamesDbConfig: Record<string, PoolOptions>) {
        this.gamesDbConfig = gamesDbConfig;
        for (const key of Object.keys(this.gamesDbConfig)) {
            await this.createDbPool(this.gamesDbConfig[key], key);
        }
    }

    async getGameDbPool(dbName: string): Promise<Pool> {
        const pool = this.pools[dbName];
        if (!pool) await this.createDbPool(this.gamesDbConfig[dbName], dbName);
        return this.pools[dbName];
    }
}

export const gamesDbConnection = GamesDbConnect.getInstance();
export const globalQueryBuilder = QueryBuilder.getInstance();

export class DbConnect {
    maxRetryCount: number;
    retryCount: number = 0;
    private pool!: Pool;
    private secretKey: string
    dbConfig: PoolOptions;
    gamesDBConfig!: Record<string, PoolOptions>;
    loadConfigQuery: string

    constructor(dbConfig: PoolOptions, maxRetryCount: number) {
        this.loadConfigQuery = `select * from config_master where data_key in ('db_config', 'games_cat', 'db_queries') and is_active = true`
        this.dbConfig = dbConfig;
        this.maxRetryCount = maxRetryCount;
        this.secretKey = process.env.CRYPTO_SECRET as string;
    };

    async initDbPoolConnection() {
        dbLogger.info(`try number ${this.retryCount}`);
        try {

            this.pool = createPool(this.dbConfig)
            const conn = await this.pool.getConnection();
            if (!this.pool || !conn) throw new Error("unable to connect");
            else {
                await conn.execute(configMaster);
                await conn.execute(gameDbConfig);
                await conn.execute(gameDbQueries);
                await conn.execute(users);
                await this.loadConfig();
                await this.loadDbConfigs();
                await this.loadDbQueries();
            }

            gamesDbConnection.initGamesDbPools(this.gamesDBConfig);
            dbLogger.info(`DB Connection Successful ${new Date().toISOString()}`)

            return;
        } catch (error: any) {
            console.error("error occured", error.message, " retry count number", this.retryCount++);
            if (this.retryCount > this.maxRetryCount) process.exit(1);
            else {
                await sleep(1000);
                await this.initDbPoolConnection();
            }
        }
    }

    async loadConfig() {
        const [rows]: any = await this.pool.query(this.loadConfigQuery);
        rows.forEach((e: ILoadDBConfigData) => {
            if (e && e.is_active == 1) {
                switch (e.data_key) {
                    case "games_cat":
                        GAMES_CATEGORIES = e.value as Record<string, string[]>;
                        break;
                    case "db_queries":
                        globalQueryBuilder.setGamesQueries(e.value as TGameDbQueries);
                        DB_GAMES_QUERIES = e.value as TGameDbQueries
                        break;
                }
            }
        });
        // this.loadGamesList();
        return;
    }

    async loadDbConfigs() {
        let conn: PoolConnection | null = null;
        try {
            conn = await this.getPool().getConnection();
            const [rows]: any = await conn.query("select * from games_db_configs where is_active = true");

            const result: TGamesDbConfig = {};

            for (const row of rows) {
                result[row.app] = {
                    host: await decryption(row.host, this.secretKey),
                    port: row.port,
                    user: await decryption(row.user, this.secretKey),
                    database: await decryption(row.default_db, this.secretKey),
                    password: await decryption(row.password, this.secretKey),
                };
            }
            this.gamesDBConfig = result
            return;
        } catch (error: any) {
            console.error("error occured:", error.message);
        }
        finally {
            if (conn) {
                conn.release()
            }
        }
    }

    async loadDbQueries() {
        let conn: PoolConnection | null = null;
        try {
            conn = await this.getPool().getConnection();
            const [rows]: any = await conn.query("select * from games_db_queries");

            for (const row of rows) {

                // for queries
                if (!DB_GAMES_QUERIES[row.genre]) {
                    DB_GAMES_QUERIES[row.genre] = {};
                }
                if (!DB_GAMES_QUERIES[row.genre][row.app]) {
                    DB_GAMES_QUERIES[row.genre][row.app] = {};
                }
                DB_GAMES_QUERIES[row.genre][row.app][row.end_point] = row.db_query;

                // for games list with categroy
                if (!DB_GAMES_LIST[row.genre]) {
                    DB_GAMES_LIST[row.genre] = [];
                }
                if (!DB_GAMES_LIST[row.genre].includes(row.app)) {
                    DB_GAMES_LIST[row.genre].push(row.app);
                }

                // for games categories
                if (!GAMES_CATEGORIES[row.game_cat] || !Array.isArray(GAMES_CATEGORIES[row.game_cat])) {
                    GAMES_CATEGORIES[row.game_cat] = []
                }
                if (!GAMES_CATEGORIES[row.game_cat].includes(row.app)) {
                    GAMES_CATEGORIES[row.game_cat].push(row.app)
                }
            }
            // console.log(DB_GAMES_QUERIES);
            // console.log(DB_GAMES_LIST);
            // console.log(GAMES_CATEGORIES);

            return;
        } catch (error: any) {
            console.error("error occurred:", error.message);
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }


    loadGamesList() {
        Object.keys(DB_GAMES_QUERIES).forEach(cat => {
            DB_GAMES_LIST[cat] = Object.keys(DB_GAMES_QUERIES[cat]);
        });
        return;
    }

    getPool() {
        return this.pool ? this.pool : createPool(this.dbConfig);
    }
}