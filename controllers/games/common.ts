import type { Request, Response, NextFunction } from "express";
import { BaseController } from "../base";
import { ERROR_STATUS_CODE } from "../../enums/statusCodes";
import { BaseCrashService } from "../../services/games/common";

class CommonController extends BaseController {
    service: BaseCrashService;
    constructor() {
        super();
        this.service = new BaseCrashService();
    }

    async getBetHistory(req: Request, res: Response, next: NextFunction) {
        const { category, app, user_id, operator_id, lobby_id, limit } = req.body;

        const path = req.route.path.replace("/", "");
        if (!app) return this.sendError(res, "invalid param args", ERROR_STATUS_CODE.BadRequest);
        if (
            typeof user_id !== "string" ||
            typeof operator_id !== "string" ||
            !user_id ||
            !operator_id
        ) return this.sendError(res, "invalid user_id or operator_id", ERROR_STATUS_CODE.BadRequest);

        let resp = await this.service.fetch({ category, app, path, user_id, operator_id, limit: Number(limit), lobby_id });
        console.log({ resp });
        if (lobby_id && typeof resp) resp = this.betDetailsDataFormatter(resp);
        else resp = this.betHistoryDataFormatter(resp)

        return this.sendSuccess(res, resp, "histroy fetched successfully");
    }


    async getTopWins(req: Request, res: Response, next: NextFunction) {

    }

    betHistoryDataFormatter = (resp: any[]) => resp.map(e => {
        return {
            bet_id: e.bet_id,
            lobby_id: e.lobby_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            hash: e.hash,
            auto_cashout: e.auto_cashout,
            max_mult: e.max_mult,
            win_amount: e.win_amount,
            status: e.status,
            created_at: e.created_at
        }
    })


    betDetailsDataFormatter = (resp: any[]) => resp.map(e => {
        return {
            bet_id: e.bet_id,
            lobby_id: e.lobby_id,
            user_id: e.user_id,
            operator_id: e.operator_id,
            hash: e.hash,
            auto_cashout: e.auto_cashout,
            max_mult: e.max_mult,
            win_amount: e.win_amount,
            status: e.status,
            created_at: e.created_at
        }
    })
}

export const commonController = new CommonController();