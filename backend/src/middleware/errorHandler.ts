import { NextFunction, Request, Response } from "express";
import { BaseError } from "../errors/baseError";
import { httpStatusCodes } from "../errors/httpStatusCodes";

const logError = (error: Error) => {
    console.error(error);
}

const logErrorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    logError(error);
    next(error);
}

const returnError = (error: BaseError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode || httpStatusCodes.INTERNAL_SERVER).send({ message: error.name });
}

const isOperationalError = (error: Error | BaseError) => {
    if(error instanceof BaseError) {
        return error.isOperational;
    }
    return false;
}

export { logError, logErrorMiddleware, returnError, isOperationalError }