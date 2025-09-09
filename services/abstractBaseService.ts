import type { PoolConnection } from "mysql2/promise";
import { GamesDbConnect, gamesDbConnection, globalQueryBuilder } from "../db/dbConnect";
import type { IFetchDataArgs, IServiceArgs } from "../interfaces/service";
import type { QueryBuilder } from "../utilities/queryBuilder";

export abstract class ABaseService {
    protected gamesDbConnect: GamesDbConnect;
    protected queries: QueryBuilder;

    constructor() {
        this.gamesDbConnect = gamesDbConnection;
        this.queries = globalQueryBuilder;
    }

    protected async getGameDbPool(app: string) {
        return await this.gamesDbConnect.getGameDbPool(app);
    }

    abstract fetch(args: IServiceArgs): Promise<any>;
    abstract fetchData(pool: PoolConnection, query: string, args: IFetchDataArgs): Promise<any>;
}
