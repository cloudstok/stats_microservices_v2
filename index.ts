import express from "express";
import { router as indexRouter } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

app.use("/api/v1", indexRouter);
app.use(errorHandler)

app.listen(3000, () => console.log("server running on port", 3000));