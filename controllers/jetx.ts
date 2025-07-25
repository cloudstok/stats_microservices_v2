import type { NextFunction, Request, Response } from "express";
import { BaseController } from "./base";

class JetX extends BaseController {
    constructor() { super(); }

    get(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "jetx get")
    }
    post(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "jetx post")
    }
}
export const jetx = new JetX();