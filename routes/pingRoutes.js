import express from "express";
import {checkServerStatus} from "../controllers/pingController.js";

const pingRouter = express.Router();
pingRouter.get('', checkServerStatus);

export default pingRouter;