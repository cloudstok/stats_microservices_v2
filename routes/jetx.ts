import { Router } from "express";
import { jetx } from "../controllers/crash-games/jetx";

const router = Router();

router.route("/").get(jetx.get).post(jetx.post);

export default router;