import express from "express";
import joi from "joi";
import {schemaValidation} from "../middleware/schemaValidation.js";
import {loginUser, registerUser} from "../controllers/userController.js";

const userRoutes = express.Router();

const schemas = {
    registerUser: joi.object().keys({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(8).max(255),
    }),
    loginUser: joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required().min(8).max(255),
    })
}

// userRoutes.post('/register', schemaValidation(schemas.registerUser, "body"), registerUser)
userRoutes.post('/login', schemaValidation(schemas.loginUser, "body"), loginUser)

export default userRoutes