import { BaseError } from "./baseError";
import { httpStatusCodes } from "./httpStatusCodes";

export class APIInternalServerError extends BaseError {
    constructor(name: string, statusCode=httpStatusCodes.INTERNAL_SERVER, description='Internal server error', isOperational=true) {
        super(name, statusCode, isOperational, description);
    }
}