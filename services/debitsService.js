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

export const insertSingleDebit = async ({emailId, subject, amount, receivedAt}) => {
    try {
        const response = await DebitModel.create({
            emailId: emailId,
            subject: subject,
            amount: amount,
            receivedAt: receivedAt,
        });
        await response.save();
        logger.info("Successfully inserted a debit");
        return response;
    } catch (e) {
        logger.error("Error inserting a debit " + e);
        throw e;
    }
}