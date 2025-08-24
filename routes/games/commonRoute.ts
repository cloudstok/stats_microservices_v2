import { Router } from "express";
import { commonController } from "../../controllers/games/common";
import { topWinRouteValidator } from "../../middlewares/notFoundHandler";

const router = Router();

router
    .get("/bet-history", commonController.getBetHistory)
    .get("/bet-details", commonController.getBetHistory)
    .get("/top-wins", topWinRouteValidator, commonController.getTopWins)

export default router;