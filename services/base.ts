import { gamesDbConnection } from "../db/dbConnect";
import type { IBetDetailArgs, IBetHistoryArgs } from "../interfaces/service";

export abstract class BaseService {
    protected gamesDbConnect = gamesDbConnection;

    protected async getGameDbPool(app: string) {
        return this.gamesDbConnect.getGameDbPool(app);
    }
    abstract betHistory(args: IBetHistoryArgs): Promise<any>;
    abstract betDetails(args: IBetDetailArgs): Promise<any>;
}
