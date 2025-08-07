import { GamesDbConnect } from "../db/dbConnect";
import type { IBetDetailArgs, IBetHistoryArgs } from "../interfaces/service";

export abstract class BaseService extends GamesDbConnect {
    abstract betHistory(args: IBetHistoryArgs): Promise<any>;
    abstract betDetails(args: IBetDetailArgs): Promise<any>;
}
