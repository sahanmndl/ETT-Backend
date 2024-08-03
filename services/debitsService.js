import {logger} from "../config/logger.js";
import DebitModel from "../models/debitModel.js";

export const insertDebitsData = async ({debitsArray}) => {
    try {
        const response = await DebitModel.insertMany(debitsArray);
        logger.info("Successfully inserted debits");
        return response;
    } catch (e) {
        logger.error("Error inserting debits " + e);
        throw e;
    }
}