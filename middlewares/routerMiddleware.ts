import { type NextFunction, type Request, type Response } from "express";
import commonRoute from "../routes/games/commonRoute"
import { notFound } from "../middlewares/notFoundHandler";
import { DB_GAMES_LIST, globalQueryBuilder } from "../db/dbConnect";

export const routerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { app, path } = req.params;

    const category = Object.keys(DB_GAMES_LIST)?.find(key => DB_GAMES_LIST[key]?.includes(app));
    if (!category) return notFound(req, res, next);

    const queryExists = globalQueryBuilder.getQueryByAppRoute(category, app, path);
    if (!queryExists) return notFound(req, res, next);

    if (!req.body) req.body = { category, app, path, ...req.query };
    else req.body = { category, app, path, ...req.body, ...req.query };

    if (app && typeof commonRoute === "function") return commonRoute(req, res, next);
    else return notFound(req, res, next);
}