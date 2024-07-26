import mongoose from 'mongoose';
import {logger} from "./logger.js";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL_PROD, {useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => logger.info("Connected to MongoDB"))
    } catch (e) {
        logger.error("Error connecting to MongoDB", e);
        process.exit(1);
    }
}