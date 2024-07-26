import UserModel from "../models/user.model.js";
import {errorAPIResponse, successAPIResponse} from "../utils/response.js";
import {createUser, generateJWTToken} from "../services/user.service.js";
import {logger} from "../config/logger.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await UserModel.findOne({email: email});
        if (existingUser) {
            return res.status(400).json(errorAPIResponse("User already exists", false));
        }

        const response = await createUser({
            name: name,
            email: email,
            password: password
        })

        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in registerUser controller " + e);
        return res.status(500).json(errorAPIResponse("Error while registering user", false));
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const existingUser = await UserModel.findOne({email: email});
        if (!existingUser) {
            return res.status(400).json(errorAPIResponse("User does not exist", false));
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser?.password);
        if (!isPasswordCorrect) {
            return res.status(400).json(errorAPIResponse("Invalid email or password", false));
        }

        const token = await generateJWTToken(existingUser);

        const response = {user: existingUser, token: token};
        return res.status(200).json(successAPIResponse(response, true));
    } catch (e) {
        logger.error("Error in loginUser controller " + e);
        return res.status(500).json(errorAPIResponse("Error while logging in user", false));
    }
};