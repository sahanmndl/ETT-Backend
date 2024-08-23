import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {connectMongoDB} from "./config/db.js";
import {logger} from "./config/logger.js";
import debitRoutes from "./routes/debitRoutes.js";
import creditRoutes from "./routes/creditRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import pingRoutes from "./routes/pingRoutes.js";
import helmet from "helmet";
import {rateLimiter} from "./config/rateLimiter.js";
import {connectToCacheDB} from "./cache/redis.js";

dotenv.config()

const app = express();
app.set('trust proxy', true)
app.use(cors())
app.use(helmet())
app.use(rateLimiter)
app.use(express.json({limit: "30mb", extended: true}))

app.use('/', pingRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/transaction', debitRoutes)
app.use('/api/v1/transaction', creditRoutes)
app.use('/api/v1/statistics', statisticsRoutes)

app.listen((process.env.PORT || 8008), async () => {
    logger.info("Server is running on port " + process.env.PORT);
    await connectMongoDB()
    await connectToCacheDB()
})
