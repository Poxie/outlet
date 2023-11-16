import { HTTPStatusCode } from "./httpStatusCodes";

export class BaseError extends Error {
    name: string;
    statusCode: HTTPStatusCode;
    isOperational: boolean;

    constructor(name: string, statusCode: HTTPStatusCode, isOperational: boolean, description: string) {
        super(description);

        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}