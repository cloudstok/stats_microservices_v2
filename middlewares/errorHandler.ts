import type { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import { ERROR_STATUS_CODE } from "../enums/statusCodes";
import { AppError } from "../utilities/AppError";

export const errorHandler: ErrorRequestHandler = async (
    err: AppError | Error,
    _: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("errorHandler called");
    const statusCode = err instanceof AppError ? err.errorCode : ERROR_STATUS_CODE.InternalServerError
    const custError = err instanceof AppError ? err : new AppError(err.message || "Something Went Wrong", statusCode)
    return res.status(statusCode).send(custError);
}
