import express from "express";
import joi from "joi";
import {schemaValidation} from "../middleware/schemaValidation.js";
import {
    addDebits,
    addSingleDebit,
    deleteDebitTransaction,
    getAllPastDebits,
    updateDebitTransaction
} from "../controllers/debitController.js";
import {verifyAuthToken} from "../middleware/authVerification.js";

const debitRoutes = express.Router();

const debitSchema = joi.object().keys({
    emailId: joi.string().min(1).max(255),
    subject: joi.string().min(1).max(255).required(),
    amount: joi.number().required().min(0),
    receivedAt: joi.date().required().allow(null),
})

const schemas = {
    addDebits: joi.array().items(debitSchema).required(),
    addSingleDebit: debitSchema,
    getAllPastDebits: joi.object().keys({
        page: joi.number().min(1).required(),
        limit: joi.number().min(25).max(100).required(),
    }),
    updateDebitTransaction: joi.object().keys({
        subject: joi.string().min(1).max(255),
        amount: joi.number().min(1),
    }),
    deleteDebitTransaction: joi.object().keys({
        debitId: joi.string().required()
    }),
}

debitRoutes.post("/debits", schemaValidation(schemas.addDebits, "body"), addDebits)
debitRoutes.post("/debits/add", schemaValidation(schemas.addSingleDebit, "body"), verifyAuthToken, addSingleDebit)
debitRoutes.get('/debits', schemaValidation(schemas.getAllPastDebits, 'query'), verifyAuthToken, getAllPastDebits)
debitRoutes.put('/debits/:debitId', schemaValidation(schemas.updateDebitTransaction, 'body'), verifyAuthToken, updateDebitTransaction)
debitRoutes.delete('/debits/:debitId', schemaValidation(schemas.deleteDebitTransaction, 'params'), verifyAuthToken, deleteDebitTransaction)

export default debitRoutes;