import {errorAPIResponse, successAPIResponse} from "../utils/response.js";
import {logger} from "../config/logger.js";
import {insertCreditsData} from "../services/creditsService.js";

export const addCredits = async (req, res, next) => {
    try {
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