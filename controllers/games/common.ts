import type { Request, Response, NextFunction } from "express";
import { BaseController } from "../base";
import { ERROR_STATUS_CODE } from "../../enums/statusCodes";
import { BaseCrashService } from "../../services/games/common";
import { BaseRespMapper } from "../../interceptor/baseRespMapper";
import type { ARespMapper } from "../../interceptor/abstractMapper";
import { GAMES_CATEGORIES } from "../../db/dbConnect";

class CommonController extends BaseController {
    service: BaseCrashService;
    mapper: BaseRespMapper
    constructor() {
        super();
        this.service = new BaseCrashService();
        this.mapper = new BaseRespMapper();
    }

    async getBetHistory(req: Request, res: Response, next: NextFunction) {
        const { category, app, path, user_id, operator_id, lobby_id, limit } = req.body;

        if (!app || !path) return this.sendError(res, "invalid param args", ERROR_STATUS_CODE.BadRequest);
        if ((path == "bet-details" && !lobby_id) || (path == "bet-history" && !limit)) return this.sendError(res, "invalid param args", ERROR_STATUS_CODE.BadRequest);
        if (
            typeof user_id !== "string" ||
            typeof operator_id !== "string" ||
            !user_id ||
            !operator_id
        ) return this.sendError(res, "invalid user_id or operator_id", ERROR_STATUS_CODE.BadRequest);

        let resp = await this.service.fetch({ category, app, path, user_id, operator_id, limit: Number(limit), lobby_id });


        const mapper: ARespMapper = this.mapper.getMapper(category, app)

        if (path == "bet-details") resp = mapper.details(resp);
        else resp = mapper.history(resp)

        return this.sendSuccess(res, resp, "histroy/details fetched successfully");
    }
}

export const commonController = new CommonController();