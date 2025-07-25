import type { Request, Response, NextFunction } from "express";
import { BaseController } from "./base";
import { ERROR_STATUS_CODE } from "../enums/statusCodes";

class Avaitor extends BaseController {
    constructor() { super(); }

    get(req: Request, res: Response, next: NextFunction) {
        return this.sendSuccess(res, {}, "avaitor get")
    }
    post(req: Request, res: Response, next: NextFunction) {
        if (!req.body) return this.sendError(res, "data is required", ERROR_STATUS_CODE.BadRequest)
        this.sendSuccess(res, req.body, "avaitor post")
    }
}

export const avaitor = new Avaitor();