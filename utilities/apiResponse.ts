import { SUCCESS_STATUS_CODE } from "../enums/statusCodes";

export class ApiResponse {
    version = "1.0.0";
    status: boolean;
    statusCode: SUCCESS_STATUS_CODE;
    data: any;
    message: string;
    constructor(data: any, message = "Request Fullfilled Successfully") {
        this.status = true;
        this.statusCode = SUCCESS_STATUS_CODE.Success;
        this.data = data;
        this.message = message;
    }
}