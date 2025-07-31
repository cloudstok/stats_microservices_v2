import type { NextFunction, Request, Response } from "express";
import { BaseController } from "../base";
import { jetxService } from "../../services/crash-games/jetx";

class JetX extends BaseController {
    service: any;
    constructor() {
        super();
        this.service = jetxService;
    }

    get(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "jetx get")
    }
    post(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "jetx post")
    }
}
export const jetx = new JetX();