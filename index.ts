import express, { json, urlencoded } from "express";
import cors from "cors";
import { router as indexRouter } from "./routes/app";
import { router as homeRouter } from "./routes/home"
import { router as configRouter } from "./routes/admin/gamesDbConfig";
import { router as userRouter } from "./routes/admin/user";
import { errorHandler } from "./middlewares/errorHandler";
import { createLogger } from "./utilities/logger";

const logger = createLogger("SERVER", "plain");

export const app = express();

app.use(cors({ origin: "*" }));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/", homeRouter);
app.use("/admin", userRouter)
app.use("/config", configRouter)
app.use("/api/v1", indexRouter);
app.use(errorHandler);

app.listen(process.env.PORT, () => logger.info(`Server Running On Port: ${process.env.PORT}`));