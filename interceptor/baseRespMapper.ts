import { GAMES_CATEGORIES } from "../db/dbConnect";
import type { ARespMapper } from "./abstractMapper";
import { CrashMapper } from "./common/mapper";
import { AAAMiniMapper } from "./custom/aaaMini";
import { FruitBurstMapper } from "./custom/fruitBurst";

export class BaseRespMapper {
    private mappers: Record<string, ARespMapper>;

    constructor() {
        this.mappers = {
            crash: new CrashMapper(),
            fruit_burst: new FruitBurstMapper(),
            aaa_mini: new AAAMiniMapper(),
        };
    }

    getMapper(category: string, app: string): ARespMapper {
        let key = category;
        if (GAMES_CATEGORIES["specific"].includes(app)) key = app;
        return this.mappers[key];
    }
}
