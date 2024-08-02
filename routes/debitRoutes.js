import express from "express";
import joi from "joi";
import {schemaValidation} from "../middleware/schemaValidation.js";
import {addDebits} from "../controllers/debitController.js";

const debitRoutes = express.Router();

const debitSchema = joi.object().keys({
    emailId: joi.string().required(),
    subject: joi.string().required(),
    amount: joi.number().required().min(0),
    receivedAt: joi.date().required().allow(null),
})

const schemas = {
    addDebits: joi.array().items(debitSchema).required(),
}

debitRoutes.post("/debits", schemaValidation(schemas.addDebits, "body"), addDebits)

export default debitRoutes;