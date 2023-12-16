import { NextFunction, Request, Response } from "express";
import { getUserIdFromHeaders } from "../utils/index";
import { APIUnauthorizedError } from "../errors/apiUnauthorizedError";
import { myDataSource } from "../app-data-source";
import { People } from "../entity/people.entity";
import { APINotFoundError } from "../errors/apiNotFoundError";

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    const selfId = await getUserIdFromHeaders(req.headers);
    if(!selfId) return next(new APIUnauthorizedError('Missing or invalid token.'));

    const user = await myDataSource.getRepository(People).findOneBy({ id: selfId });
    if(!user) return next(new APINotFoundError('User not found.'));

    res.locals.userId = selfId;
    next();
}