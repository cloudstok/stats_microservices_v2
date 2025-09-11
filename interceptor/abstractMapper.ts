export abstract class ARespMapper {

    abstract formatter(path: string, resp: any[], limit?: number): any
    abstract history(resp: any[], limit: Number): any
    abstract details(resp: any[]): any

}