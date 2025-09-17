import { GAMES_CATEGORIES } from "../db/dbConnect";
import type { ARespMapper } from "./abstractMapper";
import { CrashMapper } from "./common/crash";
import { AAAMiniMapper } from "./custom/aaaMini";
import { FruitBurstMapper } from "./custom/fruitBurst";
import { Pilot } from "./custom/pilot";
import { RiderMapper } from "./custom/riderMapper";
import { HeadsAndTailsMapper } from "./custom/headsAndTails";
import { TeenPattiTurbo } from "./custom/teenPattiTurbo";
import { CoinFlip } from "./custom/coinFlip";
import { BurstGameMapper } from "./custom/burstGame";
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
import { LuckySevenMapper } from "./custom/luckySevenMini";
import { TeenPattiMapper } from "./custom/teenPattiMini";
import { DragonTigerLionMapper } from "./custom/dragonTigerLionMini";
import { K3Mapper } from "./custom/k3";
import { LuckySpin } from "./custom/luckySpin";
import { Lines } from "./custom/lines";
import { FourAces } from "./custom/fourAces";
import { Double_roll } from "./custom/double_role";
import { KenoMapper } from "./custom/keno";
import { DiamondSlotMapper } from "./custom/diamondSlot";
import { BallBallMapper } from "./custom/ballBall";
import { CrashHiLoMapper } from "./custom/crashHilo";
import { RedQueenMapper } from "./custom/redQueen";
import { KingThimblesMapper } from "./custom/kingThimbles";
import { GoalMapper } from "./custom/goal";
import { FlashRouletteMapper } from "./custom/flashRoulette";
import { DoubleWheelGameMapper } from "./custom/doubleWheel";
import { ChickenRoadMapper } from "./custom/chickenRoad2.0";
import { SattaMatkaMapper } from "./custom/sattaMatka";
import { RunAndGuessMapper } from "./custom/runGuess";
import { TeenPatti2_0Mapper } from "./custom/teenPatti2.0";
import { ThimblesMapper } from "./custom/thimbles";
import { TwentyOneMapper } from "./custom/twentyOne";
import { PumpedxhMapper } from "./custom/pumpedx";
import { Quick3DLotteryMapper } from "./custom/quick3DLottery";
import { IndiaLotteryMapper } from "./custom/indiaLottery";
import { RapidRouletteMapper } from "./custom/rapidRoulette";
import { BacarratMapper } from "./custom/baccaratMapper";
import { Color2_0 } from "./custom/color2.0";
import { AndarBaharMapper } from "./custom/andarBahar";
import { MiniRouletteMapper } from "./custom/miniRoulette";
import { Color2DMapper } from "./custom/color2D";

export class BaseRespMapper {
    private mappers: Record<string, ARespMapper>;

    constructor() {
        this.mappers = {
            crash: new CrashMapper(),
            fruit_burst: new FruitBurstMapper(),
            aaa_mini: new AAAMiniMapper(),
            coin_pilot: new Pilot(),
            pilot: new Pilot(),
            cup_pilot: new Pilot(),
            rider: new RiderMapper(),
            heads_and_tails: new HeadsAndTailsMapper(),
            teen_patti_turbo: new TeenPattiTurbo(),
            coin_flip: new CoinFlip(),
            footballx: new BurstGameMapper(),
            balloon: new BurstGameMapper(),
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
            teen_patti_mini: new TeenPattiMapper(),
            dragon_tiger_lion: new DragonTigerLionMapper(),
            lucky_seven: new LuckySevenMapper(),
            mini: new MiniMapper(),
            k3: new K3Mapper(),
            lucky_spin: new LuckySpin(),
            lines: new Lines(),
            four_aces: new FourAces(),
            double_roll: new Double_roll(),
            keno: new KenoMapper(),
            diamond_slot: new DiamondSlotMapper(),
            ball_n_ball: new BallBallMapper(),
            crash_hilo: new CrashHiLoMapper(),
            red_queen: new RedQueenMapper(),
            king_thimbles: new KingThimblesMapper(),
            goal: new GoalMapper(),
            flash_roulette: new FlashRouletteMapper(),
            double_wheel: new DoubleWheelGameMapper(),
            chicken_road: new ChickenRoadMapper(),
            satta_matka: new SattaMatkaMapper(),
            run_and_guess: new RunAndGuessMapper(),
            teen_patti_2_0: new TeenPatti2_0Mapper(),
            thimbles: new ThimblesMapper(),
            twenty_one: new TwentyOneMapper(),
            pumpedx: new PumpedxhMapper(),
            quick_3d_lottery: new Quick3DLotteryMapper(),
            india_lottery: new IndiaLotteryMapper(),
            rapid_roulette: new RapidRouletteMapper(),
            baccarat_two: new BacarratMapper(),
            color_2: new Color2_0(),
            andar_bahar: new AndarBaharMapper(),
            mini_roulette: new MiniRouletteMapper(),
            color_2d: new Color2DMapper()
        };
    }

    getMapper(category: string, app: string): ARespMapper {
        let key = category;
        if (GAMES_CATEGORIES && GAMES_CATEGORIES["specific"].includes(app)) key = app;
        return this.mappers[key];
    }
}