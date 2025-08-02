import { sleep } from "bun";
import { createPool, type Pool, type PoolConnection, type PoolOptions } from "mysql2/promise";
import type { ILoadConfigData } from "../interfaces/db";

export class DbConnect {
    maxRetryCount: number;
    retryCount: number = 0;
    private pool!: PoolConnection;
    dbConfig: PoolOptions;
    gamesDBConfig!: Record<string, PoolOptions>;

    constructor(dbConfig: PoolOptions, maxRetryCount: number) {
        this.dbConfig = dbConfig;
        this.maxRetryCount = maxRetryCount;

        (async () => await this.initDbPoolConnection())();
    };

    async initDbPoolConnection() {
        console.log("try number", this.retryCount);
        // await sleep(1000)
        try {

            this.pool = await createPool(this.dbConfig).getConnection();
            if (!this.pool) throw new Error("unable to connect");
            else await this.loadConfig()

            new GamesDbConnect().initGamesDbPools(this.gamesDBConfig);

            return;
        } catch (error: any) {
            console.error("error occured", error.message, " retry count number", this.retryCount++);
            if (this.retryCount > this.maxRetryCount) process.exit(1);
            else await this.initDbPoolConnection();
        }
    }

    async loadConfig() {
        const [rows]: any = await this.pool.query(`select * from config_master where data_key = 'db_config' and is_active = true`);
        this.gamesDBConfig = rows.find((e: ILoadConfigData) => e.is_active === 1).value;
        return;
    }
}

export class GamesDbConnect {
    pools: Record<string, Pool>;
    gamesDbConfig: Record<string, PoolOptions>;

    constructor() {
        this.pools = {};
        this.gamesDbConfig = {};
    }

    async createDbPool(config: PoolOptions, dbName: string) {
        // console.log(config, dbName);
        this.pools[dbName] = createPool(config);
        return;
    }

    async initGamesDbPools(gamesDbConfig: Record<string, PoolOptions>) {
        this.gamesDbConfig = gamesDbConfig;
        for (const key of Object.keys(this.gamesDbConfig)) {
            // console.log(key, this.gamesDbConfig[key]);
            await this.createDbPool(this.gamesDbConfig[key], key);
            // await sleep(1000);
        }
    }

    async getGameDbPool(dbName: string): Promise<Pool> {
        const pool = this.pools[dbName];
        if (!pool) await this.createDbPool(this.gamesDbConfig[dbName], dbName);
        return this.pools[dbName];
    }
}