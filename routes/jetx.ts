import { Router } from "express";
import { jetx } from "../controllers/jetx";

const router = Router();

router.route("/").get(jetx.get).post(jetx.post);

export default router;