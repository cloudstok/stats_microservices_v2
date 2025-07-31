import type { PoolOptions } from "mysql2";

export interface ILoadConfigData {
    id: number;
    data_key: string;
    value: Record<string, PoolOptions>;
    is_active: number;
    created_at: Date;
    updated_at: Date;
}