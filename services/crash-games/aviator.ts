import type { IBetDetailArgs, IBetHistoryArgs } from "../../interfaces/service";
import { BaseService } from "../base";

export class AviatorService extends BaseService {

    async betHistory({ app, user_id, operator_id, limit }: IBetHistoryArgs): Promise<any> {
        const query = `select * from settlements where user_id = ? and operator_id = ? order by created_at desc limit ?`;
        const pool = await this.getGameDbPool(app);
        const [data] = await pool.query(query, [user_id, operator_id, limit]);
        return data;
    }
    async betDetails({ app, user_id, operator_id, lobby_id }: IBetDetailArgs): Promise<any> {
        const query = `select * from settlements where user_id = ? and operator_id = ? and lobby_id = ?`;
        const pool = await this.getGameDbPool(app);
        const [data] = await pool.query(query, [user_id, operator_id, lobby_id]);
        return data;
    }

}