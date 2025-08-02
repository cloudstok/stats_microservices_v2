import { Router } from "express";
import { aviator } from "../controllers/crash-games/aviator";

const router = Router();

router.get("/history", aviator.getBetHistory).get("/bet-details", aviator.getBetDetails);

export default router;