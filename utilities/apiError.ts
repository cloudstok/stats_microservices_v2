import type { ERROR_STATUS_CODE } from "../enums/statusCodes";


export class ApiError extends Error {
    version = "1.0.0";
    status: boolean;
    errorCode: ERROR_STATUS_CODE;
    constructor(errorCode: ERROR_STATUS_CODE, message: string) {
        super();
        this.status = false;
        this.errorCode = errorCode;
        this.message = message || "Something Went Wrong";
    }
}