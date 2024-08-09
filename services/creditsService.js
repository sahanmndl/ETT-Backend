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

export const insertSingleCredit = async ({emailId, subject, amount, receivedAt}) => {
    try {
        const response = await CreditModel.create({
            emailId: emailId,
            subject: subject,
            amount: amount,
            receivedAt: receivedAt,
        });
        await response.save();
        logger.info("Successfully inserted a credit");
        return response;
    } catch (e) {
        logger.error("Error inserting a credit " + e);
        throw e;
    }
}