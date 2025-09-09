import { Router } from "express";
import { gamesDbConfigInstance as controller } from "../../controllers/admin/gameDbConfig";
import { auth } from "../../middlewares/authMiddleware";

export const router = Router();

router.use(auth)
router.route("/").get(controller.find).post(controller.create);
router.route("/:id").patch(controller.update)
router.route("/:id/:isActive").patch(controller.updateStatus);
