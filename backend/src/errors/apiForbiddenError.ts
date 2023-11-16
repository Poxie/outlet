import { BaseError } from "./baseError";
import { httpStatusCodes } from "./httpStatusCodes";

export class APIForbiddenError extends BaseError {
    constructor(name: string, statusCode=httpStatusCodes.FORBIDDEN, description='Forbidden', isOperational=true) {
        super(name, statusCode, isOperational, description);
    }
}