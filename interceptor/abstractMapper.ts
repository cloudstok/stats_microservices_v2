export abstract class ARespMapper {

    abstract formatter(path: string, resp: any[], limit?: number, id?: string): any
    abstract history(resp: any[], limit?: Number, id?: string): any
    abstract details(resp: any[]): any

}