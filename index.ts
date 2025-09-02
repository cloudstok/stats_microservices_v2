import express from "express";
import cors from "cors";
import { router as indexRouter } from "./routes/app";
import { router as homeRouter } from "./routes/home"
import { errorHandler } from "./middlewares/errorHandler";
import { DbConnect } from "./db/dbConnect";
import { createLogger } from "./utilities/logger";

const logger = createLogger("SERVER", "plain");
export const app = express();

app.use(cors({ origin: "*" }));
app.use("/", homeRouter);
app.use("/api/v1", indexRouter);
app.use(errorHandler);

const dbInstance = new DbConnect({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}, 5);
(async () => await dbInstance.initDbPoolConnection())();

app.listen(process.env.PORT, () => logger.info(`Server Running On Port: ${process.env.PORT}`));