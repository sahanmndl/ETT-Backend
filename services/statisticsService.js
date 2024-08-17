import {logger} from "../config/logger.js";
import CreditModel from "../models/creditModel.js";
import DebitModel from "../models/debitModel.js";
import {sortMapByDate} from "../utils/functions.js";
import {DateTime} from "luxon";

export const findTotalStatistics = async ({emailId, fromDate, tillDate, timezone = 'UTC'}) => {
    try {
        let query = {emailId: emailId}
        if (fromDate) {
            const startDate = DateTime.fromJSDate(new Date(fromDate)).setZone(timezone).startOf('day').toJSDate();
            query.receivedAt = {...query.receivedAt, $gte: startDate};
        }
        if (tillDate) {
            const endDate = DateTime.fromJSDate(new Date(tillDate)).setZone(timezone).endOf('day', {}).toJSDate();
            query.receivedAt = {...query.receivedAt, $lte: endDate};
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

export const findDailyTotalStatistics = async ({emailId, timezone = 'UTC'}) => {
    try {
        const startDate = DateTime.now().setZone(timezone).startOf('day').toJSDate();
        const endDate = DateTime.now().setZone(timezone).endOf('day', {}).toJSDate();

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

export const findWeeklyDebitStatistics = async ({emailId, tillDate, timezone = 'UTC'}) => {
    try {
        const endDate = DateTime.fromJSDate(new Date(tillDate)).setZone(timezone).endOf('day').toJSDate();
        const startDate = DateTime.fromJSDate(endDate).minus({days: 7}).toJSDate();

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lte: endDate}
        };

        const debits = await DebitModel.find(query).select('receivedAt amount').lean().exec();

        const debitMap = debits.reduce((map, {receivedAt, amount}) => {
            const date = DateTime.fromJSDate(new Date(receivedAt)).setZone(timezone).toFormat('dd-MM-yyyy');
            if (!map[date]) {
                map[date] = 0;
            }
            map[date] += amount;
            return map;
        }, {});

        const sortedDebitMap = Object.fromEntries(
            Object.entries(debitMap).sort((a, b) =>
                DateTime.fromFormat(a[0], 'dd-MM-yyyy', {zone: timezone}).valueOf() -
                DateTime.fromFormat(b[0], 'dd-MM-yyyy', {zone: timezone}).valueOf()
            )
        );

        let resultArray = Object.entries(sortedDebitMap).map(([date, amount]) => ({date, amount}));

        return resultArray;
    } catch (e) {
        logger.error("Error findWeeklyDebitStatistics " + e);
        throw e;
    }
}

export const findMonthlyDebitStatistics = async ({emailId, year, timezone = 'UTC'}) => {
    try {
        const startDate = DateTime.local(year).setZone(timezone).startOf('year').toJSDate();
        const endDate = DateTime.local(year).setZone(timezone).endOf('year', {}).toJSDate();

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lt: endDate},
            amount: {$gt: 0}
        };

        const debits = await DebitModel.find(query).select('receivedAt amount').lean().exec();

        const monthlyDebitsMap = debits.reduce((map, {receivedAt, amount}) => {
            const month = DateTime.fromJSDate(new Date(receivedAt)).setZone(timezone).toFormat('yyyy-MM');
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

export const findMonthlyCreditStatistics = async ({emailId, year, timezone = 'UTC'}) => {
    try {
        const startDate = DateTime.local(year).setZone(timezone).startOf('year').toJSDate();
        const endDate = DateTime.local(year).setZone(timezone).endOf('year', {}).toJSDate();

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lt: endDate},
            amount: {$gt: 0}
        };

        const credits = await CreditModel.find(query).select('receivedAt amount').lean().exec();

        const monthlyCreditsMap = credits.reduce((map, {receivedAt, amount}) => {
            const month = DateTime.fromJSDate(new Date(receivedAt)).setZone(timezone).toFormat('yyyy-MM');
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

export const findYearlyCreditStatistics = async ({emailId, year, timezone = 'UTC'}) => {
    try {
        const startDate = DateTime.local(year).setZone(timezone).startOf('year').toJSDate();
        const endDate = DateTime.local(year).setZone(timezone).endOf('year', {}).toJSDate();

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lt: endDate},
            amount: {$gt: 0}
        };

        const credits = await CreditModel.find(query).select('receivedAt amount').lean().exec();

        const yearlyCreditsMap = credits.reduce((map, {receivedAt, amount}) => {
            const day = DateTime.fromJSDate(new Date(receivedAt)).setZone(timezone).toFormat('yyyy-MM-dd');
            if (!map[day]) {
                map[day] = 0;
            }
            map[day] += amount;
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

export const findYearlyDebitStatistics = async ({emailId, year, timezone = 'UTC'}) => {
    try {
        const startDate = DateTime.local(year).setZone(timezone).startOf('year').toJSDate();
        const endDate = DateTime.local(year).setZone(timezone).endOf('year', {}).toJSDate();

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lt: endDate},
            amount: {$gt: 0}
        };

        const debits = await DebitModel.find(query).select('receivedAt amount').lean().exec();

        const yearlyDebitsMap = debits.reduce((map, {receivedAt, amount}) => {
            const day = DateTime.fromJSDate(new Date(receivedAt)).setZone(timezone).toFormat('yyyy-MM-dd');
            if (!map[day]) {
                map[day] = 0;
            }
            map[day] += amount;
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

export const findAverageStatistics = async ({emailId, fromDate, tillDate, timezone = 'UTC'}) => {
    try {
        const startDate = DateTime.fromJSDate(new Date(fromDate)).setZone(timezone).startOf('day').toJSDate();
        const endDate = DateTime.fromJSDate(new Date(tillDate)).setZone(timezone).endOf('day', {}).toJSDate();

        const query = {
            emailId: emailId,
            receivedAt: {$gte: startDate, $lte: endDate},
        }

        const credits = await CreditModel.find(query).select('receivedAt amount').lean().exec();
        const debits = await DebitModel.find(query).select('receivedAt amount').lean().exec();

        let totalCreditAmount = 0, totalDebitAmount = 0;
        let creditsCount = 0, debitsCount = 0;
        credits.forEach((credit) => {
            if (credit.amount > 0) {
                totalCreditAmount += credit.amount;
                creditsCount++;
            }
        });
        debits.forEach((debit) => {
            if (debit.amount > 0) {
                totalDebitAmount += debit.amount;
                debitsCount++;
            }
        });
        let avgCreditAmount = creditsCount > 0 ? (totalCreditAmount / creditsCount) : 0;
        let avgDebitAmount = debitsCount > 0 ? (totalDebitAmount / debitsCount) : 0;

        return {
            averageCredit: parseFloat(avgCreditAmount.toFixed(2)),
            averageDebit: parseFloat(avgDebitAmount.toFixed(2)),
            creditTransactions: creditsCount,
            debitTransactions: debitsCount
        };
    } catch (e) {
        logger.error(`Error in findAverageStatistics: ${e}`);
        throw e;
    }
};

export const findLargestTransactions = async ({emailId, fromDate, tillDate, timezone = 'UTC'}) => {
    try {
        const query = {emailId};
        if (fromDate) {
            const startDate = DateTime.fromJSDate(new Date(fromDate)).setZone(timezone).startOf('day').toJSDate();
            query.receivedAt = {...query.receivedAt, $gte: startDate};
        }
        if (tillDate) {
            const endDate = DateTime.fromJSDate(new Date(tillDate)).setZone(timezone).endOf('day', {}).toJSDate();
            query.receivedAt = {...query.receivedAt, $lte: endDate};
        }

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