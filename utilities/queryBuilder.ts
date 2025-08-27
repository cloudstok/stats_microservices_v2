import type { TGameDbQueries } from "../interfaces/db";

export class QueryBuilder {

    private static instance: QueryBuilder;
    queries: TGameDbQueries;

    constructor() {
        this.queries = {};
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new QueryBuilder();
        }
        return this.instance;
    }

    setGamesQueries(queries: TGameDbQueries) {
        this.queries = queries;
        return;
    }

    getQueryByAppRoute(cat: string, app: string, path: string): string {
        return this.queries[cat][app][path] as string;
    }

    getCustomQuery(fields: string[], args: string[], table: string = "settlement", orderBy?: string, order?: string, limit?: number, offset?: number) {
        return `select ${fields.join(", ")} from ${table}
         where ${args.map(e => `${e} = ?`).join(" and ")}
         ${orderBy && order ? `order by ${orderBy} ${order}` : ``}
         ${limit ? `limit ${limit}` : ``}
         ${offset ? `offset ${offset}` : ``}`;
    }
}