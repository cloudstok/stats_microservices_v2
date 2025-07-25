import type { Response } from "express";
import { ERROR_STATUS_CODE, SUCCESS_STATUS_CODE } from "../enums/statusCodes";
import { asyncHandler } from "../middlewares/asyncHandler";

export class BaseController {
    version: string = "1.0.0";

    constructor() {
        const prototype = Object.getPrototypeOf(this);
        for (const method of Object.getOwnPropertyNames(prototype)) {
            if (method !== "constructor" && typeof prototype[method] === "function") {
                (this as any)[method] = asyncHandler((this as any)[method].bind(this))
            }
        }
    }

    sendSuccess = async (res: Response, data: any = {}, msg: string = "success") =>
        res.status(SUCCESS_STATUS_CODE.Success).send({
            version: this.version,
            statusCode: SUCCESS_STATUS_CODE.Success,
            message: msg,
            data,
        });

    sendError = async (res: Response, errMsg: string = "Something Went Wrong", errCode: ERROR_STATUS_CODE = ERROR_STATUS_CODE.InternalServerError) =>
        res.status(errCode).send({
            version: this.version,
            statusCode: errCode,
            message: errMsg,
            data: null,
        });
}
