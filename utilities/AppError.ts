import type { ERROR_STATUS_CODE } from "../enums/statusCodes";

export class AppError extends Error {
    version = "1.0.0";
    errorCode: ERROR_STATUS_CODE;
    status: boolean;
    message: string;
    constructor(message: string = "Something Went Wrong", errorCode: ERROR_STATUS_CODE,) {
        super(message);
        this.status = false;
        this.errorCode = errorCode;
        this.message = message;
    }
}