import { NextFunction, Request, Response } from "express";
import { getUserIdFromHeaders } from "../utils/index";
import { APIUnauthorizedError } from "../errors/apiUnauthorizedError";
import { APINotFoundError } from "../errors/apiNotFoundError";
import People from "../modules/people";

const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    const selfId = await getUserIdFromHeaders(req.headers);
    if(!selfId) return next(new APIUnauthorizedError('Missing or invalid token.'));

    const user = await People.getById(selfId);
    if(!user) return next(new APINotFoundError('User not found.'));

    res.locals.userId = selfId;
    next();
}
export default authHandler;