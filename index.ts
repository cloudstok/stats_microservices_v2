import express, { json, urlencoded } from "express";
import indexRouter from "./routes";
import { errorHandler } from "./middlewares/errorMiddleware";

export const app = express()

app.use(json());
app.use(urlencoded({ extended: true }));


app.use("/api/v1/", indexRouter);
app.use(errorHandler)

app.listen(3000, () => console.log("server running on port:", 3000));