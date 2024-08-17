import {
    deleteDebitById,
    fetchAllPastDebits,
    insertDebitsData,
    insertSingleDebit,
    updateDebit
} from "../services/debitsService.js";
import {errorAPIResponse, successAPIResponse} from "../utils/response.js";
import {logger} from "../config/logger.js";

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

export const getAllPastDebits = async (req, res, next) => {
    try {
        const {emailId} = req.body;
        const {page, limit} = req.query;
        const response = await fetchAllPastDebits({
            emailId: emailId,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 25
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in getAllPastDebits controller " + e);
        return res.status(500).json(errorAPIResponse("Error getting all past debits", false));
    }
}

export const updateDebitTransaction = async (req, res, next) => {
    try {
        const {debitId} = req.params;
        const {subject, amount} = req.body;
        const response = await updateDebit({
            debitId: debitId,
            subject: subject,
            amount: parseFloat(amount),
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in updateDebitTransaction controller " + e);
        return res.status(500).json(errorAPIResponse("Error updating debit", false));
    }
}

export const deleteDebitTransaction = async (req, res, next) => {
    try {
        const {debitId} = req.params;
        const response = await deleteDebitById({debitId: debitId})
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in deleteDebitTransaction controller " + e);
        return res.status(500).json(errorAPIResponse("Error deleting debit", false));
    }
}