import express from "express";
import joi from "joi";
import {schemaValidation} from "../middleware/schemaValidation.js";
import {addDebits, addSingleDebit} from "../controllers/debitController.js";
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
    addSingleDebit: debitSchema
}

debitRoutes.post("/debits", schemaValidation(schemas.addDebits, "body"), addDebits)
debitRoutes.post("/debits/add", schemaValidation(schemas.addSingleDebit, "body"), verifyAuthToken, addSingleDebit)

export default debitRoutes;