import { Router } from "express";
import { commonController } from "../../controllers/games/common";
import { topWinRouteValidator } from "../../middlewares/notFoundHandler";

const router = Router();

router.get("/", topWinRouteValidator, commonController.getBetHistory)

export default router;