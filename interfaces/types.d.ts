type TimeUnit = "YEAR" | "MONTH" | "WEEK" | "DAY";
type TOrder = "HW" | "BW" | "MW";
type TMethod = "findById" | "find" | "post" | "patch" | "delete";
type TMethodArgs = Record<string, string | number | boolean>;
type TDbConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}
type TGamesDbConfig = Record<string, TDbConfig>