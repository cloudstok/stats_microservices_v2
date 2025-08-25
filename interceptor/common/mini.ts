import { ARespMapper } from "../abstractMapper";

export class MiniMapper extends ARespMapper {
    history(resp: any[]) {
        return { message: "mini games mapper" }
    }
    details(resp: any[]) {
        return { message: "mini games mapper" }
    }

}