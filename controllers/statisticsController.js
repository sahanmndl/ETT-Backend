import {
    findAverageStatistics,
    findDailyTotalStatistics, findLargestTransactions,
    findMonthlyCreditStatistics, findMonthlyDebitStatistics,
    findTotalStatistics,
    findWeeklyDebitStatistics, findYearlyCreditStatistics, findYearlyDebitStatistics
} from "../services/statisticsService.js";
import {errorAPIResponse, successAPIResponse} from "../utils/response.js";
import {logger} from "../config/logger.js";

export const getTotalStatistics = async (req, res, next) => {
    try {
        logger.info(`Entering getTotalStatistics controller with IP-Address: ${req.ip}`);
        const {emailId} = req.body;
        const {fromDate, tillDate} = req.query;
        const response = await findTotalStatistics({
            emailId: emailId,
            fromDate: fromDate,
            tillDate: tillDate
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in addCredits controller " + e);
        return res.status(500).json(errorAPIResponse("Error getting total statistics", false));
    }
}

export const getDailyTotalStatistics = async (req, res, next) => {
    try {
        const {emailId} = req.body;
        const response = await findDailyTotalStatistics({emailId: emailId})
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in getDailyTotalStatistics controller " + e);
        return res.status(500).json(errorAPIResponse("Error getting daily statistics", false));
    }
}

export const getWeeklyDebitStatistics = async (req, res, next) => {
    try {
        const {emailId} = req.body;
        const {tillDate} = req.query;
        const response = await findWeeklyDebitStatistics({
            emailId: emailId,
            tillDate: tillDate
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in getWeeklyDebitStatistics controller " + e);
        return res.status(500).json(errorAPIResponse("Error getting weekly debit statistics", false));
    }
}

export const getMonthlyDebitStatistics = async (req, res, next) => {
    try {
        const {emailId} = req.body;
        const {year} = req.query;
        const response = await findMonthlyDebitStatistics({
            emailId: emailId,
            year: parseInt(year),
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in getMonthlyDebitStatistics controller " + e);
        return res.status(500).json(errorAPIResponse("Error getting monthly debit statistics", false));
    }
}

export const getMonthlyCreditStatistics = async (req, res, next) => {
    try {
        const {emailId} = req.body;
        const {year} = req.query;
        const response = await findMonthlyCreditStatistics({
            emailId: emailId,
            year: parseInt(year),
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in getMonthlyCreditStatistics controller " + e);
        return res.status(500).json(errorAPIResponse("Error getting monthly credit statistics", false));
    }
}

export const getYearlyCreditStatistics = async (req, res, next) => {
    try {
        const {emailId} = req.body;
        const {year} = req.query;
        const response = await findYearlyCreditStatistics({
            emailId: emailId,
            year: parseInt(year),
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in getYearlyCreditStatistics controller " + e);
        return res.status(500).json(errorAPIResponse("Error getting yearly credit statistics", false));
    }
}

export const getYearlyDebitStatistics = async (req, res, next) => {
    try {
        const {emailId} = req.body;
        const {year} = req.query;
        const response = await findYearlyDebitStatistics({
            emailId: emailId,
            year: parseInt(year),
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in getYearlyDebitStatistics controller " + e);
        return res.status(500).json(errorAPIResponse("Error getting yearly debit statistics", false));
    }
}

export const getAverageStatistics = async (req, res, next) => {
    try {
        const {emailId} = req.body;
        const {fromDate, tillDate} = req.query;
        const response = await findAverageStatistics({
            emailId: emailId,
            fromDate: fromDate,
            tillDate: tillDate
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in getAverageStatistics controller " + e);
        return res.status(500).json(errorAPIResponse("Error getting average statistics", false));
    }
}

export const getLargestTransactionAmount = async (req, res, next) => {
    try {
        const {emailId} = req.body;
        const {fromDate, tillDate} = req.query;
        const response = await findLargestTransactions({
            emailId: emailId,
            fromDate: fromDate,
            tillDate: tillDate
        })
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in getLargestTransactionAmount controller " + e);
        return res.status(500).json(errorAPIResponse("Error getting largest transaction statistics", false));
    }
}