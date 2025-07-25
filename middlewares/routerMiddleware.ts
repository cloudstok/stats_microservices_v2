import { type NextFunction, type Request, type Response } from "express";
import avaitor from "../routes/avaitor"
import crashx from "../routes/crashx"
import jetx from "../routes/jetx"
import { notFound } from "../middlewares/notFoundHandler";

const globalRouter = {
    avaitor,
    crashx,
    jetx
} as const;

type RouteKey = keyof typeof globalRouter

export const routerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const app = req.params.app;
    const route = globalRouter[app as RouteKey];

    if (app && typeof route === "function") {
        return route(req, res, next)
    }

    return notFound(req, res, next);
}