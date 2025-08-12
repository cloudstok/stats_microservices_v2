import type { IBetDetailArgs, IBetHistoryArgs } from "../../interfaces/service";
import { BaseService } from "../base";

export class BaseCrashService extends BaseService {

    async betHistory({ category, app, path, user_id, operator_id, limit }: IBetHistoryArgs): Promise<any> {
        let query = this.queries.getQueryByAppRoute(category, app, path);
        const pool = await this.getGameDbPool(app);
        const [data] = await pool.query(query, [user_id, operator_id, limit]);
        return data;
    }
    async betDetails({ category, app, path, user_id, operator_id, lobby_id }: IBetDetailArgs): Promise<any> {
        const query = this.queries.getQueryByAppRoute(category, app, path);
        const pool = await this.getGameDbPool(app);
        const [data] = await pool.query(query, [user_id, operator_id, lobby_id]);
        return data;
    }

}