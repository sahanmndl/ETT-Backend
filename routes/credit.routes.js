import express from "express";
import joi from "joi";
import {schemaValidation} from "../middleware/schemaValidation.js";
import {addCredits} from "../controllers/credit.controller.js";

const creditRoutes = express.Router();

const creditSchema = joi.object().keys({
    emailId: joi.string().required(),
    subject: joi.string().required(),
    amount: joi.number().required().min(0),
    receivedAt: joi.date().required().allow(null),
})

const schemas = {
    addCredits: joi.array().items(creditSchema).required(),
}

creditRoutes.post("/credits", schemaValidation(schemas.addCredits, "body"), addCredits)

export default creditRoutes;