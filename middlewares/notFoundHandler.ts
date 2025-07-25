import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utilities/AppError";
import { ERROR_STATUS_CODE } from "../enums/statusCodes";

export const notFound = (_: Request, __: Response, next: NextFunction) =>
    next(new AppError("Route Not Found", ERROR_STATUS_CODE.NotFound));
