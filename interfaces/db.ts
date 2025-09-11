import type { PoolOptions } from "mysql2";

export interface ILoadConfigData {
    id: number;
    data_key: string;
    is_active: number;
    created_at: Date;
    updated_at: Date;
}

export interface ILoadDBConfigData extends ILoadConfigData {
    value: Record<string, PoolOptions>;
}

export type TGameDbQueries = Record<string, Record<string, Record<string, string>>>

export interface ILoadDBQueriesData extends ILoadConfigData {
    value: TGameDbQueries;
}
