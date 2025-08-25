import { RespMapper } from "./common/mapper";
import { MiniMapper } from "./common/mini";
import { FruitBurstMapper } from "./custom/fruitBurst";

export class BaseRespMapper {
    protected mapper: RespMapper
    protected mini: MiniMapper
    protected fruitBurst: FruitBurstMapper

    constructor() {
        this.mapper = new RespMapper()
        this.mini = new MiniMapper()
        this.fruitBurst = new FruitBurstMapper()
    }
}