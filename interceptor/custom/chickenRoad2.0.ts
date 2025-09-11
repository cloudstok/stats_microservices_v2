import { ARespMapper } from "../abstractMapper";

export class ChickenRoadMapper extends ARespMapper {
    constructor() {
        super();
    }

    formatter(path: string, resp: any[]) {
        let formattedResp;
        switch (path) {
            case "bet-history":
                formattedResp = this.history(resp);
                break;
            case "bet-details":
                formattedResp = this.details(resp);
                break;
            default:
                formattedResp = resp;
                break;
        }
        return formattedResp;
    }

    history = (resp: any[]) => {
        return resp;
    };

    details = (resp: any[]) => {
        if (!resp || resp.length == 0) return {};
        return resp[0];
    };
}
