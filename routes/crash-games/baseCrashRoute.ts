import { Router } from "express";
import { baseCrashController } from "../../controllers/crash-games/baseCrashController";

const router = Router();

router
    .get("/history", baseCrashController.getBetHistory)
    .get("/bet-details", baseCrashController.getBetDetails)

export default router;