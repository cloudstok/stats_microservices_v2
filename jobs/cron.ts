import nodeCron from "node-cron";
import { dbInstance } from "../db/dbInstance";

export const startJobs = async () => {
    try {

        nodeCron.schedule("*/15 * * * *", async () => {
            await dbInstance.loadDbConfigs();
            await dbInstance.loadDbQueries();
        })

    } catch (error: any) {
        console.error("error occured:", error.message);
    }
}