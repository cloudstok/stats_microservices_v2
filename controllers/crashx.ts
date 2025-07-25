import type { NextFunction, Request, Response } from "express";
import { BaseController } from "./base";

class CrashX extends BaseController {
    constructor() { super(); }

    get(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "crashx get")
    }
    post(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "crashx post")
    }
}
export const crashx = new CrashX();