import { Router, type NextFunction, type Request, type Response } from "express";
import avaitor from "./avaitor";
import crash from "./crash";
import jetx from "./jetx";
import { notFound } from "../controllers/notFound";

type RouterKey = keyof typeof globalRouters;

export const globalRouters = {
    avaitor,
    crash,
    jetx,
} as const;

export const routingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const appName = req.params.app;
    const extractedRouter = globalRouters[appName as RouterKey];
    if (extractedRouter && typeof extractedRouter == "function") {
        return extractedRouter(req, res, next);
    }
    next();
};

const router = Router();
router.use("/:app", routingMiddleware, notFound)

export default router;