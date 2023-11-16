import { BaseError } from "./baseError";
import { httpStatusCodes } from "./httpStatusCodes";

export class APIUnauthorizedError extends BaseError {
    constructor(name: string, statusCode=httpStatusCodes.UNAUTHORIZED, description='Unauthorized', isOperational=true) {
        super(name, statusCode, isOperational, description);
    }
}