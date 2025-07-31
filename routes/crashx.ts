import { Router } from "express";
import { crashx } from "../controllers/crash-games/crashx";

const router = Router();

router.route("/").get(crashx.get).post(crashx.post);

export default router;