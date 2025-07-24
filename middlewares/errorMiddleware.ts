// errorHandler.ts
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utilities/apiError";
import { ERROR_STATUS_CODE } from "../enums/statusCodes";

export const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = (err instanceof ApiError && err.errorCode) || ERROR_STATUS_CODE.InternalServerError;
    return res.status(statusCode).json(new ApiError(statusCode, err.message || "Something Went Wrong"));
};
