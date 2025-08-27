import { RespMapper } from "./common/mapper";
import { AAAMiniMapper } from "./custom/aaaMini";
import { FruitBurstMapper } from "./custom/fruitBurst";

export class BaseRespMapper {
    protected mapper: RespMapper
    protected fruit_burst: FruitBurstMapper
    protected aaa_mini: AAAMiniMapper

    constructor() {
        this.mapper = new RespMapper()
        this.fruit_burst = new FruitBurstMapper()
        this.aaa_mini = new AAAMiniMapper()
    }
}