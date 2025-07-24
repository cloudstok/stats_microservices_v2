import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utilities/apiError";
import { ERROR_STATUS_CODE } from "../enums/statusCodes";

export const notFound = (_: Request, res: Response, next: NextFunction) => {
    return res.status(404).send(new ApiError(ERROR_STATUS_CODE.NotFound, "Route Not Found"));
}