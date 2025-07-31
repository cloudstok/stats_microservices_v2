import { GamesDbConnect } from "../db/dbConnect";

export abstract class BaseService extends GamesDbConnect {
    abstract betHistory(user_id: string, operator_id: string, limit: number): Promise<any>;
    abstract betDetails(user_id: string, operator_id: string, lobby_id: string): Promise<any>;
}
