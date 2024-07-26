import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {connectMongoDB} from "./config/db.js";
import {logger} from "./config/logger.js";
import debitRoutes from "./routes/debit.routes.js";
import creditRoutes from "./routes/credit.routes.js";
import statisticsRoutes from "./routes/statistics.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config()

const app = express();
app.use(cors())
app.use(express.json({limit: "30mb", extended: true}))

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/transaction', debitRoutes)
app.use('/api/v1/transaction', creditRoutes)
app.use('/api/v1/statistics', statisticsRoutes)

app.listen((process.env.PORT || 8008), async () => {
    logger.info("Server is running on port " + process.env.PORT);
    await connectMongoDB()
})
