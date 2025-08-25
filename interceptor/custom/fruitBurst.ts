import { ARespMapper } from "../abstractMapper";

export class FruitBurstMapper extends ARespMapper {
    history(resp: any[]) {
        throw new Error("Method not implemented.");
    }
    details(resp: any[]) {
        throw new Error("Method not implemented.");
    }
    constructor() {
        super();
    }
}