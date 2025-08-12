import { gamesDbConnection, globalQueryBuilder } from "../db/dbConnect";
import type { IBetDetailArgs, IBetHistoryArgs } from "../interfaces/service";
import type { QueryBuilder } from "../utilities/queryBuilder";

export abstract class BaseService {
    protected gamesDbConnect;
    protected queries: QueryBuilder;

    constructor() {
        this.gamesDbConnect = gamesDbConnection;
        this.queries = globalQueryBuilder;

    }

    protected async getGameDbPool(app: string) {
        return this.gamesDbConnect.getGameDbPool(app);
    }
    abstract betHistory(args: IBetHistoryArgs): Promise<any>;
    abstract betDetails(args: IBetDetailArgs): Promise<any>;
}
