import {errorAPIResponse, successAPIResponse} from "../utils/response.js";
import {logger} from "../config/logger.js";
import {insertCreditsData, insertSingleCredit} from "../services/creditsService.js";

export const addCredits = async (req, res, next) => {
    try {
        logger.info(`Entering addCredits controller with IP-Address: ${req.ip}`);
        
        const creditsArray = req.body
        logger.info("Entering addCredits controller with emails of length " + creditsArray.length);
        const response = await insertCreditsData({creditsArray: creditsArray})
        logger.info("Exiting addCredits controller");
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in addCredits controller " + e);
        return res.status(500).json(errorAPIResponse("Cannot add credits data", false));
    }
}

export const addSingleCredit = async (req, res, next) => {
    try {
        logger.info(`Entering addSingleCredit controller with IP-Address: ${req.ip}`);

        const {emailId, subject, amount, receivedAt} = req.body
        const response = await insertSingleCredit({
            emailId: emailId,
            subject: subject,
            amount: amount,
            receivedAt: receivedAt
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in addSingleCredit controller " + e);
        return res.status(500).json(errorAPIResponse("Cannot add credit", false));
    }
}