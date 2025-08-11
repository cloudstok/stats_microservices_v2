import type { Request, Response, NextFunction } from "express";
import { BaseController } from "../base";
import { ERROR_STATUS_CODE } from "../../enums/statusCodes";
import { BaseCrashService } from "../../services/crash-games/baseCrashService";

class BaseCrashController extends BaseController {
    service: BaseCrashService;
    constructor() {
        super();
        this.service = new BaseCrashService();
    }

    async getBetHistory(req: Request, res: Response, next: NextFunction) {
        const { category, app, user_id, operator_id, limit = 10, } = req.body;

        const path = req.route.path.replace("/", "");
        if (!app) return this.sendError(res, "invalid param args", ERROR_STATUS_CODE.BadRequest);

        if (
            typeof user_id !== "string" ||
            typeof operator_id !== "string" ||
            !user_id ||
            !operator_id
        ) return this.sendError(res, "invalid user_id or operator_id", ERROR_STATUS_CODE.BadRequest);

        let data = await this.service.betHistory({ category, app, path, user_id, operator_id, limit: Number(limit) });

        return this.sendSuccess(res, data, "histroy fetched successfully");
    }
    async getBetDetails(req: Request, res: Response, next: NextFunction) {
        const { category, app, user_id, operator_id, lobby_id } = req.body;
        const path = req.route.path.replace("/", "");
        if (!app) return this.sendError(res, "invalid param args");

        if (
            typeof user_id !== "string" ||
            typeof operator_id !== "string" ||
            typeof lobby_id !== "string" ||
            !user_id ||
            !operator_id ||
            !lobby_id
        ) return this.sendError(res, "invalid user_id, operator_id or lobby_id", ERROR_STATUS_CODE.BadRequest);

        const data = await this.service.betDetails({ category, app, path, user_id, operator_id, lobby_id });
        return this.sendSuccess(res, data, "bet details fetched successfully");
    }
}

export const baseCrashController = new BaseCrashController();