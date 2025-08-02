import type { IBetDetailArgs, IBetHistoryArgs } from "../../interfaces/service";
import { BaseService } from "../base";

export class JetxService extends BaseService {
    async betHistory(data: IBetHistoryArgs): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async betDetails(data: IBetDetailArgs): Promise<any> {
        throw new Error("Method not implemented.");
    }

}