import type { Request, Response, NextFunction } from "express";
import { BaseController } from "../base";
import { ERROR_STATUS_CODE } from "../../enums/statusCodes";
import { BaseCrashService } from "../../services/games/common";
import { BaseRespMapper } from "../../interceptor/baseRespMapper";
import type { ARespMapper } from "../../interceptor/abstractMapper";

class CommonController extends BaseController {
    service: BaseCrashService;
    mapper: BaseRespMapper
    constructor() {
        super();
        this.service = new BaseCrashService();
        this.mapper = new BaseRespMapper();
    }

    async getBetHistory(req: Request, res: Response, next: NextFunction) {
        const { category, app, user_id, operator_id, lobby_id, limit } = req.body;
        console.log(req.originalUrl, req.url, req.baseUrl, req.path,);
        const path = req.route.path.replace("/", "");
        if (!app) return this.sendError(res, "invalid param args", ERROR_STATUS_CODE.BadRequest);
        if (
            typeof user_id !== "string" ||
            typeof operator_id !== "string" ||
            !user_id ||
            !operator_id
        ) return this.sendError(res, "invalid user_id or operator_id", ERROR_STATUS_CODE.BadRequest);

        let resp = await this.service.fetch({ category, app, path, user_id, operator_id, limit: Number(limit), lobby_id });

        const mapperKey = category as keyof BaseRespMapper
        const mapper: ARespMapper = this.mapper[mapperKey]

        if (lobby_id && typeof resp) resp = mapper.details(resp);
        else resp = mapper.history(resp)

        return this.sendSuccess(res, resp, "histroy fetched successfully");
    }

    async getTopWins(req: Request, res: Response, next: NextFunction) {

    }
}

export const commonController = new CommonController();