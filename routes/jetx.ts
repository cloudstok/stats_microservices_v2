import { Router } from "express";
import { get, post } from "../controllers/jetx";

export const router = Router();

router.route("/").get(get).post(post);

export default router;