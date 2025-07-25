import { Router } from "express";
import { routerMiddleware } from "../middlewares/routerMiddleware";
import { notFound } from "../middlewares/notFoundHandler";

export const router = Router();

router.use("/:app", routerMiddleware, notFound)