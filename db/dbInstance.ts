import { startJobs } from "../jobs/cron";
import { DbConnect } from "./dbConnect";

export const dbInstance = new DbConnect({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}, 5);
(async () => {
    await dbInstance.initDbPoolConnection()
    await startJobs();
})();