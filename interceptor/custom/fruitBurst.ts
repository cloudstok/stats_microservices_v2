import { ARespMapper } from "../abstractMapper";

export class FruitBurstMapper extends ARespMapper {
    constructor() {
        super();
    }
    formatter(path: string, resp: any[]) {
        let formattedResp
        switch (path) {
            case "bet-history": formattedResp = this.history(resp);
                break;
            case "bet-details": formattedResp = this.details(resp);
                break;
            default: formattedResp = resp;
                break;
        }
        return formattedResp;
    }
    history(resp: any[]) {
        throw new Error("Method not implemented.");
    }
    details(resp: any[]) {
        throw new Error("Method not implemented.");
    }
}