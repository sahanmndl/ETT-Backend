import {logger} from "../config/logger.js";
import CreditModel from "../models/credit.model.js";
import DebitModel from "../models/debit.model.js";
import moment from "moment";
import {sortMapByDate} from "../utils/functions.js";

export const findTotalStatistics = async ({emailId, fromDate, tillDate}) => {
    try {
        let query = {emailId: emailId}
        if (fromDate) {
            query.receivedAt = {...query.receivedAt, $gte: new Date(fromDate)}
        }
        if (tillDate) {
            query.receivedAt = {...query.receivedAt, $lte: new Date(tillDate)}
        }

        const credits = await CreditModel.find(query).select('amount').lean().exec()
        const debits = await DebitModel.find(query).select('amount').lean().exec()

        const totalCredits = credits.reduce((sum, credit) => sum + credit.amount, 0).toFixed(2);
        const totalDebits = debits.reduce((sum, debit) => sum + debit.amount, 0).toFixed(2);
        const totalBalance = (totalCredits - totalDebits).toFixed(2);

        return {
            totalCredits: parseFloat(totalCredits),
            totalDebits: parseFloat(totalDebits),
            totalBalance: parseFloat(totalBalance)
        }
    } catch (e) {
        logger.error("Error totalStatistics " + e);
        throw e;
    }
}

export const findDailyTotalStatistics = async ({emailId}) => {
    try {
        const startDate = moment().startOf('day').toDate()
        const endDate = moment().endOf('day').toDate()

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lte: endDate}
        };

        const credits = await CreditModel.find(query).select('amount').lean().exec()
        const debits = await DebitModel.find(query).select('amount').lean().exec()

        const dailyCredits = credits.reduce((sum, credit) => sum + credit.amount, 0).toFixed(2);
        const dailyDebits = debits.reduce((sum, debit) => sum + debit.amount, 0).toFixed(2);

        return {dailyCredits: parseFloat(dailyCredits), dailyDebits: parseFloat(dailyDebits)}
    } catch (e) {
        logger.error("Error findDailyTotalStatistics " + e);
        throw e;
    }
}

export const findWeeklyDebitStatistics = async ({emailId, tillDate}) => {
    try {
        const endDate = new Date(tillDate);
        const startDate = moment(endDate).subtract(7, 'days').toDate();

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lte: endDate}
        };

        const debits = await DebitModel.find(query).select('receivedAt amount').lean().exec();

        const debitMap = debits.reduce((map, {receivedAt, amount}) => {
            const date = moment(new Date(receivedAt)).format('DD-MM-YYYY');
            if (!map[date]) {
                map[date] = 0;
            }
            map[date] += amount;
            return map;
        }, {});

        const sortedDebitMap = Object.fromEntries(
            Object.entries(debitMap).sort((a, b) => moment(a[0], 'DD-MM-YYYY') - moment(b[0], 'DD-MM-YYYY'))
        );
        let resultArray = []
        Object.entries(sortedDebitMap).map((debit, index) => {
            resultArray.push({date: debit[0], amount: debit[1]})
        })

        return resultArray;
    } catch (e) {
        logger.error("Error findWeeklyDebitStatistics " + e);
        throw e;
    }
}

export const findMonthlyDebitStatistics = async ({emailId, year}) => {
    try {
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year + 1}-01-01T00:00:00.000Z`);

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lte: endDate}
        };

        const debits = await DebitModel.find(query).select('receivedAt amount').lean().exec();

        const monthlyDebitsMap = debits.reduce((map, {receivedAt, amount}) => {
            const month = moment(new Date(receivedAt)).format('YYYY-MM')
            if (!map[month]) {
                map[month] = 0;
            }
            map[month] += amount;
            return map;
        }, {});

        const sortedMonthlyDebitsMap = sortMapByDate(monthlyDebitsMap);
        let resultArray = []
        Object.entries(sortedMonthlyDebitsMap).map((debit, index) => {
            resultArray.push({month: debit[0], amount: debit[1]})
        })

        return resultArray;
    } catch (e) {
        logger.error("Error in findMonthlyDebitStatistics " + e);
        throw e;
    }
}

export const findMonthlyCreditStatistics = async ({emailId, year}) => {
    try {
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year + 1}-01-01T00:00:00.000Z`);

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lte: endDate}
        };

        const credits = await CreditModel.find(query).select('receivedAt amount').lean().exec();

        const monthlyCreditsMap = credits.reduce((map, {receivedAt, amount}) => {
            const month = moment(new Date(receivedAt)).format('YYYY-MM')
            if (!map[month]) {
                map[month] = 0;
            }
            map[month] += amount;
            return map;
        }, {});

        const sortedMonthlyCreditsMap = sortMapByDate(monthlyCreditsMap);
        let resultArray = []
        Object.entries(sortedMonthlyCreditsMap).map((debit, index) => {
            resultArray.push({month: debit[0], amount: debit[1]})
        })

        return resultArray;
    } catch (e) {
        logger.error("Error in findMonthlyCreditStatistics " + e);
        throw e;
    }
}

export const findYearlyCreditStatistics = async ({emailId, year}) => {
    try {
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year + 1}-01-01T00:00:00.000Z`);

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lt: endDate}
        };

        const credits = await CreditModel.find(query).select('receivedAt amount').lean().exec();

        const yearlyCreditsMap = credits.reduce((map, {receivedAt, amount}) => {
            const month = moment(new Date(receivedAt)).format('YYYY-MM-DD')
            if (!map[month]) {
                map[month] = 0;
            }
            map[month] += amount;
            return map;
        }, {});

        const resultArray = Object.entries(yearlyCreditsMap).map(([date, amount]) => ({
            date,
            amount
        }));
        resultArray.sort((a, b) => new Date(a.date) - new Date(b.date));

        return resultArray;
    } catch (e) {
        logger.error("Error in findYearlyCreditStatistics " + e);
        throw e;
    }
}

export const findYearlyDebitStatistics = async ({emailId, year}) => {
    try {
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year + 1}-01-01T00:00:00.000Z`);

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lt: endDate}
        };

        const debits = await DebitModel.find(query).select('receivedAt amount').lean().exec();

        const yearlyDebitsMap = debits.reduce((map, {receivedAt, amount}) => {
            const month = moment(new Date(receivedAt)).format('YYYY-MM-DD')
            if (!map[month]) {
                map[month] = 0;
            }
            map[month] += amount;
            return map;
        }, {});

        const resultArray = Object.entries(yearlyDebitsMap).map(([date, amount]) => ({
            date,
            amount
        }));
        resultArray.sort((a, b) => new Date(a.date) - new Date(b.date));

        return resultArray;
    } catch (e) {
        logger.error("Error in findYearlyDebitStatistics " + e);
        throw e;
    }
}

export const findAverageStatistics = async ({emailId, period}) => {
    try {
        let startDate, endDate, groupBy;
        const now = moment();

        switch (period) {
            case 'daily':
                startDate = now.startOf('day').toDate();
                endDate = now.endOf('day').toDate();
                groupBy = {$dateToString: {format: "%Y-%m-%d", date: "$receivedAt"}};
                break;
            case 'monthly':
                startDate = now.startOf('month').toDate();
                endDate = now.endOf('month').toDate();
                groupBy = {$dateToString: {format: "%Y-%m", date: "$receivedAt"}};
                break;
            case 'yearly':
                startDate = now.startOf('year').toDate();
                endDate = now.endOf('year').toDate();
                groupBy = {$dateToString: {format: "%Y", date: "$receivedAt"}};
                break;
            default:
                throw new Error('Invalid period specified');
        }

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lte: endDate}
        };

        const creditAgg = await CreditModel.aggregate([
            {$match: query},
            {
                $group: {
                    _id: groupBy,
                    avgCredit: {$avg: "$amount"},
                    count: {$sum: 1}
                }
            }
        ]);

        const debitAgg = await DebitModel.aggregate([
            {$match: query},
            {
                $group: {
                    _id: groupBy,
                    avgDebit: {$avg: "$amount"},
                    count: {$sum: 1}
                }
            }
        ]);

        const avgCredit = creditAgg.length > 0 ? creditAgg[0].avgCredit : 0;
        const avgDebit = debitAgg.length > 0 ? debitAgg[0].avgDebit : 0;
        const creditCount = creditAgg.length > 0 ? creditAgg[0].count : 0;
        const debitCount = debitAgg.length > 0 ? debitAgg[0].count : 0;

        return {
            period,
            averageCredit: parseFloat(avgCredit.toFixed(2)),
            averageDebit: parseFloat(avgDebit.toFixed(2)),
            creditTransactions: creditCount,
            debitTransactions: debitCount
        };
    } catch (e) {
        logger.error(`Error in findAverageStatistics: ${e}`);
        throw e;
    }
};

export const findLargestTransactions = async ({emailId, fromDate, tillDate}) => {
    try {
        const query = {emailId};
        if (fromDate) query.receivedAt = {...query.receivedAt, $gte: new Date(fromDate)};
        if (tillDate) query.receivedAt = {...query.receivedAt, $lte: new Date(tillDate)};

        const [maxCredit] = await CreditModel.find(query)
            .sort({amount: -1})
            .limit(1)
            .lean()
            .exec();

        const [maxDebit] = await DebitModel.find(query)
            .sort({amount: -1})
            .limit(1)
            .lean()
            .exec();

        return {
            largestCredit: maxCredit ? {amount: maxCredit.amount, date: maxCredit.receivedAt} : null,
            largestDebit: maxDebit ? {amount: maxDebit.amount, date: maxDebit.receivedAt} : null
        };
    } catch (e) {
        logger.error(`Error in findLargestTransactions: ${e}`);
        throw e;
    }
};