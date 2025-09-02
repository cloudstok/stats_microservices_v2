import { Router } from "express";
import { SUCCESS_STATUS_CODE } from "../enums/statusCodes";

export const router = Router();

router.get("/", (req, res) => {
    return res.status(200).send({ statusCode: SUCCESS_STATUS_CODE.Success, message: "🌚Stats V2 Says HI!!!...🛸" })
})