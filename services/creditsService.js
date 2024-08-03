import {logger} from "../config/logger.js";
import CreditModel from "../models/creditModel.js";

export const insertCreditsData = async ({creditsArray}) => {
    try {
        const response = await CreditModel.insertMany(creditsArray);
        logger.info("Successfully inserted credits");
        return response;
    } catch (e) {
        logger.error("Error inserting credits " + e);
        throw e;
    }
}