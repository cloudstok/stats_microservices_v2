import type { Request, Response } from "express";
import bcrypt from "bcrypt"
import { userService, type UserService } from "../../services/admin/user";
import { BaseController } from "../base";
import { ERROR_STATUS_CODE } from "../../enums/statusCodes";
import { generateAccessToken } from "../../utilities/jwt";

export class User extends BaseController {
    service: UserService;
    constructor() {
        super()
        this.service = userService;
    }

    async signUp(req: Request, res: Response) {
        let { name, password, role = "admin" } = req.body;
        if (!name || !password) return this.sendError(res, "userId and password are required", ERROR_STATUS_CODE.BadRequest);

        const userExists: any = await this.service.findByName(name);
        if (userExists) return this.sendError(res, "user already exists", ERROR_STATUS_CODE.Conflict);

        // CHECK FOR USER ID EXISTS, SHOULD BE A UTILITY FUNCTION
        const userId = name + "_" + Math.floor(Math.random() * 10000);
        password = await bcrypt.hash(password, 10);

        const user: any = await this.service.create({ userId, name, password, role });
        if (!user || !user.insertId) return this.sendError(res, "unable to create new user", ERROR_STATUS_CODE.InternalServerError);

        const newUser: any = await this.service.findOne(userId);
        return this.sendSuccess(res, { userId: newUser.user_id, role: newUser.role, name: newUser.name }, "login successful")
    }
    async signIn(req: Request, res: Response) {
        const { userId, password } = req.body;
        if (!userId || !password) return this.sendError(res, "userId and password are required", ERROR_STATUS_CODE.BadRequest);

        const userExists: any = await this.service.findOne(userId);
        if (!userExists) return this.sendError(res, "invalid user id", ERROR_STATUS_CODE.BadRequest);

        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        if (!isPasswordValid) return this.sendError(res, "invalid password");

        const token = generateAccessToken({ userId: userExists.user_id, role: userExists.role });
        return this.sendSuccess(res, token, "login successful");
    }

}

export const userInstance = new User();