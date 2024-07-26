import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import {errorAPIResponse} from "../utils/response.js";

dotenv.config();

export const verifyAuthToken = async (req, res, next) => {
    try {
        const token = req?.header('Authorization')?.split(" ")[1];
        if (!token) {
            return res.status(401).json(errorAPIResponse("Unauthorized", false));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.body.userId = decoded?.userId || '';
        req.body.emailId = decoded?.emailId || '';
        next();
    } catch (error) {
        return res.status(401).json(errorAPIResponse("Invalid or Expired token", false));
    }
}