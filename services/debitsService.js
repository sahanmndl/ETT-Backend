import {logger} from "../config/logger.js";
import DebitModel from "../models/debitModel.js";
import {getDataFromCache, setDataInCache} from "../cache/redis.js";
import {cacheTTL} from "../utils/constants.js";
import {DateTime} from "luxon";

export const insertDebitsData = async ({debitsArray = []}) => {
    try {
        const response = await DebitModel.insertMany(debitsArray);
        if (debitsArray.length > 0) {
            const emailId = debitsArray[0].emailId;
            await updateDebitCacheCount(emailId, debitsArray.length);
        }
        logger.info("Successfully inserted debits");
        return response;
    } catch (e) {
        logger.error("Error inserting debits " + e);
        throw e;
    }
}

export const insertSingleDebit = async ({emailId, subject, amount, receivedAt}) => {
    try {
        const response = await DebitModel.create({
            emailId: emailId,
            subject: subject,
            amount: amount,
            receivedAt: receivedAt,
        });
        await response.save();
        await updateDebitCacheCount(emailId, 1);
        logger.info("Successfully inserted a debit");
        return response;
    } catch (e) {
        logger.error("Error inserting a debit " + e);
        throw e;
    }
}

export const fetchAllPastDebits = async ({emailId, page, limit, timezone = 'UTC'}) => {
    try {
        const skip = (page - 1) * limit;
        const debits = await DebitModel.find({
            emailId: emailId
        })
            .sort({receivedAt: -1})
            .select('_id subject amount receivedAt')
            .skip(skip)
            .limit(limit + 1)
            .lean()
            .exec();

        const hasMore = debits.length > limit;
        const result = debits.slice(0, limit).map((debit) => {
            const date = DateTime.fromJSDate(new Date(debit?.receivedAt)).setZone(timezone).toFormat('dd/MM/yyyy hh:mm a');
            return {...debit, receivedAt: date};
        })

        const count = await updateDebitCacheCount(emailId);

        return {
            debits: result,
            hasMore: hasMore,
            count: count
        };
    } catch (e) {
        logger.error(`Error in fetchPastDebits: ${e}`);
        throw e;
    }
}

export const updateDebit = async ({debitId, subject, amount}) => {
    try {
        const update = {}
        if (subject) update.subject = subject;
        if (amount) update.amount = amount;

        const updatedDebit = await DebitModel.findByIdAndUpdate(debitId, update, {
            new: true
        })
            .select('_id subject amount receivedAt')
            .lean()
            .exec();

        return updatedDebit;
    } catch (e) {
        logger.error(`Error in updateDebit: ${e}`);
        throw e;
    }
}

export const deleteDebitById = async ({debitId, emailId}) => {
    try {
        const deletedDebit = await DebitModel.findByIdAndDelete(debitId).lean().exec();
        await updateDebitCacheCount(emailId, -1);
        return deletedDebit;
    } catch (e) {
        logger.error(`Error in deleteDebitById: ${e}`);
        throw e;
    }
}

export const updateDebitCacheCount = async (emailId, value = 0) => {
    try {
        const cacheKey = `DEBITS_COUNT_${emailId}`
        let count = parseFloat(await getDataFromCache(cacheKey))
        if (!count) {
            count = await DebitModel.countDocuments({emailId: emailId});
            await setDataInCache(cacheKey, cacheTTL.TRANSACTIONS_COUNT, count);
        }
        if (value !== 0) {
            count += value;
            await setDataInCache(cacheKey, cacheTTL.TRANSACTIONS_COUNT, count);
        }
        logger.info(`Debit cache count has been updated for ${emailId}: ${count}`);
        return count;
    } catch (e) {
        logger.error(`Error in updateDebitCacheInfo: ${e}`);
    }
}