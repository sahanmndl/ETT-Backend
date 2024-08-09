import {insertDebitsData, insertSingleDebit} from "../services/debitsService.js";
import {errorAPIResponse, successAPIResponse} from "../utils/response.js";
import {logger} from "../config/logger.js";
import {insertSingleCredit} from "../services/creditsService.js";

export const addDebits = async (req, res, next) => {
    try {
        logger.info(`Entering addDebits controller with IP-Address: ${req.ip}`);
        
        const debitsArray = req.body
        logger.info("Entering addDebits controller with emails of length " + debitsArray.length);
        const response = await insertDebitsData({debitsArray: debitsArray})
        logger.info("Exiting addDebits controller");
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in addDebits controller " + e);
        return res.status(500).json(errorAPIResponse("Cannot add debits data", false));
    }
}

export const addSingleDebit = async (req, res, next) => {
    try {
        logger.info(`Entering addSingleDebit controller with IP-Address: ${req.ip}`);

        const {emailId, subject, amount, receivedAt} = req.body
        const response = await insertSingleDebit({
            emailId: emailId,
            subject: subject,
            amount: amount,
            receivedAt: receivedAt
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in addSingleDebit controller " + e);
        return res.status(500).json(errorAPIResponse("Cannot add debit", false));
    }
}