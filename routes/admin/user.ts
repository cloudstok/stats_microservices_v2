import { Router } from "express";
import { userInstance as controller } from "../../controllers/admin/user";
import { auth } from "../../middlewares/authMiddleware";

export const router = Router();

router.route("/signIn").post(controller.signIn);
router.use(auth)
router.route("/signUp").post(controller.signUp);