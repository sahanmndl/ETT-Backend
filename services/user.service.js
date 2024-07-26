import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import {logger} from "../config/logger.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateJWTToken = async (user) => {
    try {
        return jwt.sign({userId: user._id, emailId: user.email}, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRY_DURATION
        });
    } catch (e) {
        logger.error("Error generateJWTToken " + e);
        throw e;
    }
}

export const createUser = async ({name, email, password}) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await UserModel.create({
            name: name,
            email: email,
            password: hashedPassword,
        });
        await newUser.save()

        const token = await generateJWTToken(newUser);

        return {user: newUser, token: token};
    } catch (e) {
        logger.error("Error createUser " + e);
        throw e;
    }
};