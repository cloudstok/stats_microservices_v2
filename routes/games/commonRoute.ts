import { Router } from "express";
import { commonController } from "../../controllers/games/common";

const router = Router();

router.get("/", commonController.getBetHistory)

export default router;