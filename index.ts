import express from "express";
import { router as indexRouter } from "./routes/app";
import { router as homeRouter } from "./routes/home"
import { errorHandler } from "./middlewares/errorHandler";
import { DbConnect } from "./db/dbConnect";
import cors from "cors"

export const app = express();

app.use(cors({ origin: "*" }))
app.use("/", homeRouter)
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

app.listen(process.env.PORT, () => console.log("server running on port", process.env.PORT));