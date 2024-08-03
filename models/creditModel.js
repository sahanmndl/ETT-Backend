import mongoose, {Schema} from "mongoose";
import {collectionNames} from "../utils/constants.js";

const creditSchema = new Schema({
    emailId: {type: Schema.Types.String, required: true},
    subject: {type: Schema.Types.String, required: true},
    amount: {type: Schema.Types.Number, required: true},
    receivedAt: {type: Schema.Types.Date, required: true},
}, {timestamps: true});

const CreditModel = mongoose.model(collectionNames.CREDIT, creditSchema);
export default CreditModel