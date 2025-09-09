import { GAMES_CATEGORIES } from "../db/dbConnect";
import type { ARespMapper } from "./abstractMapper";
import { CrashMapper } from "./common/crash";
import { AAAMiniMapper } from "./custom/aaaMini";
import { FruitBurstMapper } from "./custom/fruitBurst";
import { CoinPilot } from "./custom/coinPilot";
import { RiderMapper } from "./custom/riderMapper";
import { HeadsAndTailsMapper } from "./custom/headsAndTails";
import { TeenPattiTurbo } from "./custom/teenPattiTurbo";
import { CoinFlip } from "./custom/coinFlip";
import { LotteryMapper } from "./common/lottery";

export class BaseRespMapper {
    private mappers: Record<string, ARespMapper>;

    constructor() {
        this.mappers = {
            crash: new CrashMapper(),
            fruit_burst: new FruitBurstMapper(),
            aaa_mini: new AAAMiniMapper(),
            coin_pilot: new CoinPilot(),
            pilot: new CoinPilot(),
            rider: new RiderMapper(),
            heads_and_tails: new HeadsAndTailsMapper(),
            teen_patti_turbo: new TeenPattiTurbo(),
            coin_flip: new CoinFlip(),
            lottery: new LotteryMapper()
        };
    }

    getMapper(category: string, app: string): ARespMapper {
        let key = category;
        if (GAMES_CATEGORIES && GAMES_CATEGORIES["specific"].includes(app)) key = app;
        return this.mappers[key];
    }
}
