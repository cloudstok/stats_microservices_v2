type TimeUnit = "YEAR" | "MONTH" | "WEEK" | "DAY";
type TOrder = "HW" | "BW" | "MW";
type TMethod = "findById" | "find" | "post" | "patch" | "delete";
type TMethodArgs = Record<string, string | number | boolean>;
type TDbConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}
type TConfigFromDb = TDbConfig & {
    app: string;
    id: number;
    port: number;
    is_active: number;
    default_db: string;
    created_at: string;
    updated_at: string;
}
type TGamesDbConfig = Record<string, TDbConfig>