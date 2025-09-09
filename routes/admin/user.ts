import { Router } from "express";
import { userInstance as controller } from "../../controllers/admin/user";

export const router = Router();

router.route("/signIn").post(controller.signIn);
router.route("/signUp").post(controller.signUp);