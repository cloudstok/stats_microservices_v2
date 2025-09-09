import type { NextFunction, Request, Response } from "express";
import { userService } from "../services/admin/user";
const jwt = require("jsonwebtoken");

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                message: "Authorization failed",
            });
        }

        const token = authorization.replace("Bearer ", "");
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!payload) {
            return res.status(401).json({
                message: "Authorization failed",
            });
        }

        if (payload.exp && payload.exp < Date.now() / 1000) {
            return res.status(401).json({
                message: "Token has expired",
            });
        }

        const user = await userService.findOne(payload.userId);
        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }
        if (!req.body) req.body = {}
        req.body["user"] = {
            userId: payload.userId,
            role: payload.role,
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};