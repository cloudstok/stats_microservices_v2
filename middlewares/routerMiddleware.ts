import { type NextFunction, type Request, type Response } from "express";
import crash from "../routes/crash-games/baseCrashRoute"
import { notFound } from "../middlewares/notFoundHandler";
import { DB_GAMES_LIST } from "../db/dbConnect";

const globalRouter = {
    crash
} as const;

type RouteKey = keyof typeof globalRouter

export const routerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const app = req.params.app;

    const category = Object.keys(DB_GAMES_LIST)?.find(key => DB_GAMES_LIST[key]?.includes(app));
    if (!category) return notFound(req, res, next);

    if (!req.body) req.body = { app, category, ...req.query };
    else req.body = { ...req.body, app, category, ...req.query };

    const route = globalRouter[category as RouteKey];
    if (app && typeof route === "function") return route(req, res, next);

    return notFound(req, res, next);
}