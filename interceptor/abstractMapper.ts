export abstract class ARespMapper {

    abstract formatter(path: string, resp: any[]): any
    abstract history(resp: any[]): any
    abstract details(resp: any[]): any

}