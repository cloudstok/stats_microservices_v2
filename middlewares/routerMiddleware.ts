import { type NextFunction, type Request, type Response } from "express";
import crashRouter from "../routes/crash-games/baseCrashRoute"
import { notFound } from "../middlewares/notFoundHandler";
import { DB_GAMES_LIST } from "../db/dbConnect";

const globalRouter = {
    crashRouter
} as const;

type RouteKey = keyof typeof globalRouter

export const routerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const app = req.params.app;
    if (!DB_GAMES_LIST.includes(app)) return notFound(req, res, next);

    const route = globalRouter[app as RouteKey];
    if (app && typeof route === "function") return route(req, res, next);

    return notFound(req, res, next);
}