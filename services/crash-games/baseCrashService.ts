import type { IBetDetailArgs, IBetHistoryArgs } from "../../interfaces/service";
import { BaseService } from "../base";

export class BaseCrashService extends BaseService {

    async betHistory({ app, user_id, operator_id, limit }: IBetHistoryArgs): Promise<any> {
        const query = `select * from settlement where user_id = ? and operator_id = ? order by created_at desc limit ?`;
        const pool = await this.getGameDbPool(app);
        const [data] = await pool.query(query, [user_id, operator_id, limit]);
        return data;
    }
    async betDetails({ app, user_id, operator_id, lobby_id }: IBetDetailArgs): Promise<any> {
        const query = `select * from settlement where user_id = ? and operator_id = ? and lobby_id = ?`;
        const pool = await this.getGameDbPool(app);
        const [data]: any = await pool.query(query, [user_id, operator_id, lobby_id]);
        return data[0];
    }

}