import {insertDebitsData} from "../services/debit.service.js";
import {errorAPIResponse, successAPIResponse} from "../utils/response.js";
import {logger} from "../config/logger.js";

export const addDebits = async (req, res, next) => {
    try {
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