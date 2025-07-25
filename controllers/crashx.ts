import type { NextFunction, Request, Response } from "express";
import { BaseController } from "./base";
import { crashXService } from "../services/crashx";

class CrashX extends BaseController {
    service: any;
    constructor() {
        super();
        this.service = crashXService;
    }

    get(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "crashx get")
    }
    post(req: Request, res: Response, next: NextFunction) {
        this.sendSuccess(res, {}, "crashx post")
    }
}
export const crashx = new CrashX();