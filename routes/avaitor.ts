import { Router } from "express";
import { avaitor } from "../controllers/crash-games/avaitor";

const router = Router();

router.route("/").get(avaitor.get).post(avaitor.post);

export default router;