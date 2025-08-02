import type { NextFunction, Request, Response } from "express";
import { BaseController } from "../base";
import { JetxService } from "../../services/crash-games/jetx";

class JetX extends BaseController {
    service: JetxService;
    constructor() {
        super();
        this.service = new JetxService();
    }

    get(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "jetx get")
    }
    post(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "jetx post")
    }
}
export const jetx = new JetX();