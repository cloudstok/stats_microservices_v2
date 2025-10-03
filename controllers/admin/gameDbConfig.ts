import type { Request, Response } from "express";
import { BaseController } from "../base";
import { GamesDbConfigService } from "../../services/admin/gamesDbConfig";
import { decryption, encryption } from "../../utilities/crypto";
import { ERROR_STATUS_CODE } from "../../enums/statusCodes";

export class GamesDbConfig extends BaseController {
    service: GamesDbConfigService;
    secretKey: string;
    encrypt: (plainText: string, secret: string) => Promise<any>;
    decrypt: (app: string, strToDecrypt: string, secret: string) => Promise<any>;

    constructor() {
        super();
        this.secretKey = process.env.CRYPTO_SECRET as string;
        this.encrypt = encryption;
        this.decrypt = decryption;
        this.service = new GamesDbConfigService();
    }

    async find(req: Request, res: Response) {
        let { app } = req.query;
        app = decodeURIComponent(String(app));
        let method: TMethod = "find";
        let reqObj: Record<string, string> = {};
        if (app && (app != "undefined")) {
            method = "findById";
            reqObj["app"] = app;
        }
        let data = await this.service.executeQuery(method, "games_db_configs", reqObj);
        data = Array.isArray(data) ? data : [data];
        data = data.map((e: TConfigFromDb) => {
            return {
                app: e.app,
                host: e.host,
                port: e.port,
                user: e.user,
                password: e.password,
                database: e.default_db,
                isActive: e.is_active,
            }
        })
        return this.sendSuccess(res, data, "data fetched successfully");
    }

    async create(req: Request, res: Response) {
        let { app, host, user, default_db, password } = req.body;
        if (!app || !host || !user || !default_db || !password) return this.sendError(res, "invalid payload", ERROR_STATUS_CODE.BadRequest);
        [host, user, default_db, password] = await Promise.all([host, user, default_db, password].map(e => this.encrypt(e, this.secretKey)));
        const data = await this.service.executeQuery("post", "games_db_configs", { app, host, user, default_db, password });
        return this.sendSuccess(res, { id: data.insertId }, "insert successful");
    }

    async createMult(req: Request, res: Response) {
        let { configs }: { configs: any[] } = req.body;
        let isInvalid = 0;
        let hashedConfigs: any[] = []
        if (!Array.isArray(configs) || !configs.length) isInvalid++;
        for await (let { app, host, user, default_db, password } of configs) {
            if (!app || !host || !user || !default_db || !password) isInvalid++;
            console.log(app, host, user, default_db, password);
            [host, user, default_db, password] = await Promise.all([host, user, default_db, password].map(e => this.encrypt(e, this.secretKey)));
            console.log(app, host, user, default_db, password);
            hashedConfigs.push({ app, host, user, default_db, password })
        }
        if (isInvalid) return this.sendError(res, "invalid payload", ERROR_STATUS_CODE.BadRequest);
        const data = await this.service.executeQuery("post_mult", "games_db_configs", hashedConfigs);
        return this.sendSuccess(res, data, "multiple insert successful");
    }

    async update(req: Request, res: Response) {
        let id = req.params.id;
        let { app, host, user, db, password } = req.body;
        [app, host, user, db, password] = [app, host, user, db, password].map(e => decodeURIComponent(String(e)));
        [host, user, db, password] = await Promise.all([host, user, db, password].map(e => this.encrypt(e, this.secretKey)));
        const data: any = await this.service.executeQuery("patch", "games_db_configs", { app, host, user, default_db: db, password, }, { id });
        return this.sendSuccess(res, data, "update successful");
    }

    async updateStatus(req: Request, res: Response) {
        let { id, isActive } = req.params;
        const data = await this.service.executeQuery("patch", "games_db_configs", { is_active: isActive }, { id });
        return this.sendSuccess(res, data, "update successful")
    }
}

export const gamesDbConfigInstance = new GamesDbConfig();