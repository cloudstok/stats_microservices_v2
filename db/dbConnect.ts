import { createPool, type Pool, type PoolConnection, type PoolOptions } from "mysql2/promise";
import type { ILoadDBConfigData, TGameDbQueries } from "../interfaces/db";
import { sleep } from "bun";
import { QueryBuilder } from "../utilities/queryBuilder";

export let DB_GAMES_LIST: Record<string, string[]> = {};

export class GamesDbConnect {
    private static instance: GamesDbConnect;
    pools: Record<string, Pool>;
    gamesDbConfig: Record<string, PoolOptions>;

    constructor() {
        this.pools = {};
        this.gamesDbConfig = {};
    }

    static getInstance() {
        if (!this.instance) this.instance = new GamesDbConnect();
        return this.instance;
    }

    async createDbPool(config: PoolOptions, dbName: string) {
        this.pools[dbName] = createPool(config);
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
    private pool!: PoolConnection;
    dbConfig: PoolOptions;
    gamesDBConfig!: Record<string, PoolOptions>;
    loadConfigQuery: string

    constructor(dbConfig: PoolOptions, maxRetryCount: number) {
        this.loadConfigQuery = `select * from config_master where data_key in ('db_config', 'game_category', 'db_queries') and is_active = true`
        this.dbConfig = dbConfig;
        this.maxRetryCount = maxRetryCount;

        (async () => await this.initDbPoolConnection())();
    };

    async initDbPoolConnection() {
        console.log("try number", this.retryCount);
        await sleep(1000)
        try {

            this.pool = await createPool(this.dbConfig).getConnection();
            if (!this.pool) throw new Error("unable to connect");
            else await this.loadConfig()
            gamesDbConnection.initGamesDbPools(this.gamesDBConfig);

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
        rows.forEach((
            e: ILoadDBConfigData
        ) => {
            if (e.is_active == 1) {
                switch (e.data_key) {
                    case "db_config": this.gamesDBConfig = e.value as Record<string, PoolOptions>; break;
                    case "game_category": DB_GAMES_LIST = e.value as Record<string, string[]>; break;
                    case "db_queries": globalQueryBuilder.setGamesQueries(e.value as TGameDbQueries); break;
                }
            }
            console.log(globalQueryBuilder.queries);
        });
        return;
    }
}