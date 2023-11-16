import { BaseError } from "./baseError";
import { httpStatusCodes } from "./httpStatusCodes";

export class APIBadRequestError extends BaseError {
    constructor(name: string, statusCode=httpStatusCodes.BAD_REQUEST, description='Bad request', isOperational=true) {
        super(name, statusCode, isOperational, description);
    }
}