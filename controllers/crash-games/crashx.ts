import type { NextFunction, Request, Response } from "express";
import { BaseController } from "../base";
import { CrashXService } from "../../services/crash-games/crashx";

class CrashX extends BaseController {
    service: CrashXService;
    constructor() {
        super();
        this.service = new CrashXService();
    }

    get(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "crashx get")
    }
    post(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "crashx post")
    }
}
export const crashx = new CrashX();