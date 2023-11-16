import { NextFunction, Request, Response } from "express";
import { getUserIdFromHeaders } from "../utils/auth";
import { APIUnauthorizedError } from "../errors/apiUnauthorizedError";
import { APIForbiddenError } from "../errors/apiForbiddenError";
import { getCourse } from "../routes/courses";
import { APINotFoundError } from "../errors/apiNotFoundError";
import { getSection } from "../routes/sections";

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    const selfId = await getUserIdFromHeaders(req.headers);
    if(!selfId) return next(new APIUnauthorizedError('Missing or invalid access token.'));

    let userId: string;
    if(req.params.userId) {
        userId = req.params.userId;
        if(userId === 'me') userId = selfId;
    } else if(req.params.courseId) {
        const course = await getCourse(req.params.courseId);
        if(!course) return next(new APINotFoundError('Course not found.'));
        res.locals.course = course;
        userId = course.author.id;
    } else if(req.params.sectionId) {
        const section = await getSection(req.params.sectionId);
        if(!section) return next(new APINotFoundError('Section not found,'));
        res.locals.section = section;
        userId = section.authorId;
    }

    if(userId !== selfId) return next(new APIForbiddenError('Missing access.'));

    res.locals.userId = userId;
    res.locals.selfId = selfId;
    next();
}