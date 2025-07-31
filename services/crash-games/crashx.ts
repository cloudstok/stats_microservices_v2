import { BaseService } from "../base";

class CrashXService extends BaseService {
    async betHistory(user_id: string, operator_id: string, limit: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async betDetails(user_id: string, operator_id: string, lobby_id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
export const crashXService = new CrashXService()