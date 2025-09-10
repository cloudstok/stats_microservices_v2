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
import { FootballXMapper } from "./custom/footballx";
import { SevenUpDownMapper } from "./custom/sevenUpDown";
import { ThirtyTwoCardsMapper } from "./custom/thirtyTwoCardsMini";
import { LotteryMapper } from "./common/lottery";
import { TwistMapper } from "./custom/twist";
import { MinesMapper } from "./custom/mines";
import { PlinkoMapper } from "./custom/plinko";
import { ColorPredictionMapper } from "./custom/colorPrediction";
import { VortexMapper } from "./custom/vortex";
import { MoreSlotsMapper } from "./custom/moreSlots";
import { CricketMinesMapper } from "./custom/cricketMines";
import { DragonTigerMapper } from "./custom/dragonTigerMini";
import { BollywoodCasinoMapper } from "./custom/bollywoodCasinoMini";
import { SuperOverMapper } from "./custom/superoverMini";
import { DoCardTeenPattiMapper } from "./custom/doCardTeenPattiMini";
import { MiniMapper } from "./common/mini";

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
            footballx: new FootballXMapper(),
            seven_up_down: new SevenUpDownMapper(),
            thirty_two_cards: new ThirtyTwoCardsMapper(),
            lottery: new LotteryMapper(),
            twist: new TwistMapper(),
            mines: new MinesMapper(),
            plinko: new PlinkoMapper(),
            color: new ColorPredictionMapper(),
            vortex: new VortexMapper(),
            more_slot: new MoreSlotsMapper(),
            cricket_mines: new CricketMinesMapper(),
            dragon_tiger: new DragonTigerMapper(),
            bollywood_casino: new BollywoodCasinoMapper(),
            superover: new SuperOverMapper(),
            do_card_teen_patti: new DoCardTeenPattiMapper(),
            mini: new MiniMapper(),
        };
    }

    getMapper(category: string, app: string): ARespMapper {
        let key = category;
        if (GAMES_CATEGORIES && GAMES_CATEGORIES["specific"].includes(app)) key = app;
        return this.mappers[key];
    }
}
