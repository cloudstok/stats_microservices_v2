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

    async getBetHistory(req: Request, res: Response) {
        const { category, app, path, user_id, operator_id, lobby_id, limit, freq, unit } = req.body;

        if ((path == "bet-details" && !lobby_id) ||
            (path == "bet-history" && !limit) ||
            (path == "top-win" && (!freq || !unit))
        ) return this.sendError(res, "invalid param args", ERROR_STATUS_CODE.BadRequest);

        // payload validator

        let resp = await this.service.fetch({ category, app, path, user_id, operator_id, limit: Number(limit || "20"), lobby_id, freq, unit });
        const mapper: ARespMapper = this.mapper.getMapper(category, app)

        resp = mapper.formatter(path, resp, limit)

        return this.sendSuccess(res, resp, `${path} fetched successfully`);
    }
}

export const commonController = new CommonController();