import express from "express";
import joi from "joi";
import {schemaValidation} from "../middleware/schemaValidation.js";
import {
    getAverageStatistics,
    getDailyTotalStatistics, getLargestTransactionAmount,
    getMonthlyCreditStatistics, getMonthlyDebitStatistics,
    getTotalStatistics,
    getWeeklyDebitStatistics, getYearlyCreditStatistics, getYearlyDebitStatistics
} from "../controllers/statisticsController.js";
import {verifyAuthToken} from "../middleware/authVerification.js";

const statisticsRoutes = express.Router();

const schemas = {
    getTotalStatistics: joi.object().keys({
        fromDate: joi.string(),
        tillDate: joi.string(),
        timezone: joi.string().required(),
    }),
    getDailyTotalStatistics: joi.object().keys({
        timezone: joi.string().required(),
    }),
    getWeeklyDebitStatistics: joi.object().keys({
        tillDate: joi.string().required(),
        timezone: joi.string().required(),
    }),
    getMonthlyDebitStatistics: joi.object().keys({
        year: joi.number().required().min(2024),
        timezone: joi.string().required(),
    }),
    getMonthlyCreditStatistics: joi.object().keys({
        year: joi.number().required().min(2024),
        timezone: joi.string().required(),
    }),
    getYearlyCreditStatistics: joi.object().keys({
        year: joi.number().required().min(2024),
        timezone: joi.string().required(),
    }),
    getYearlyDebitStatistics: joi.object().keys({
        year: joi.number().required().min(2024),
        timezone: joi.string().required(),
    }),
    getAverageStatistics: joi.object().keys({
        fromDate: joi.string().required(),
        tillDate: joi.string().required(),
        timezone: joi.string().required(),
    }),
    getLargestTransactionAmount: joi.object().keys({
        fromDate: joi.string(),
        tillDate: joi.string(),
        timezone: joi.string().required(),
    })
}

statisticsRoutes.get('/total', schemaValidation(schemas.getTotalStatistics, 'query'), verifyAuthToken, getTotalStatistics)
statisticsRoutes.get('/daily/total', schemaValidation(schemas.getTotalStatistics, 'query'), verifyAuthToken, getDailyTotalStatistics)
statisticsRoutes.get('/weekly/debit', schemaValidation(schemas.getWeeklyDebitStatistics, 'query'), verifyAuthToken, getWeeklyDebitStatistics)
statisticsRoutes.get('/monthly/debit', schemaValidation(schemas.getMonthlyDebitStatistics, 'query'), verifyAuthToken, getMonthlyDebitStatistics)
statisticsRoutes.get('/monthly/credit', schemaValidation(schemas.getMonthlyCreditStatistics, 'query'), verifyAuthToken, getMonthlyCreditStatistics)
statisticsRoutes.get('/yearly/credit', schemaValidation(schemas.getYearlyCreditStatistics, 'query'), verifyAuthToken, getYearlyCreditStatistics)
statisticsRoutes.get('/yearly/debit', schemaValidation(schemas.getYearlyDebitStatistics, 'query'), verifyAuthToken, getYearlyDebitStatistics)
statisticsRoutes.get('/average', schemaValidation(schemas.getAverageStatistics, 'query'), verifyAuthToken, getAverageStatistics)
statisticsRoutes.get('/largest', schemaValidation(schemas.getLargestTransactionAmount, 'query'), verifyAuthToken, getLargestTransactionAmount)

export default statisticsRoutes;