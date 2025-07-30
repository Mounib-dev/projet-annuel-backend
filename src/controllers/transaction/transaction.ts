import { RequestHandler } from "express";
import { Transaction } from "../../models/Transaction";
import {
  generateInternalServerErrorMessage,
  generateNotFoundBalanceErrorMessage,
  generateNotFoundTransactionsErrorMessage,
} from "../../helpers/generateErrorResponse";
import { Balance } from "../../models/Balance";

import { updateRecommendationReady } from "../../services/goal/updateRecommandationReady";

export const createTransaction: RequestHandler = async (
  req,
  res
): Promise<any> => {
  const { transactionType, category, amount, description, date, user } =
    req.body;
  const transaction = new Transaction({
    type: transactionType,
    category,
    amount,
    description,
    date,
    user: user.id,
  });
  try {
    await transaction.save();

    const userBalance = await Balance.findOne({
      user: user.id,
    });
    if (userBalance && transactionType === "expense") {
      userBalance.amount -= +amount;
      await userBalance.save();
    } else if (userBalance && transactionType === "income") {
      userBalance.amount += +amount;
      await userBalance.save();
    } else {
      return res.status(404).json(generateNotFoundBalanceErrorMessage());
    }
    await updateRecommendationReady(user.id);
    return res.status(201).json({
      message: "Transaction created successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateInternalServerErrorMessage());
  }
};

export const retrieveTransactions: RequestHandler = async (
  req,
  res
): Promise<any> => {
  const userId = req.body.user.id;
  try {
    const transactions = await Transaction.find({ user: userId });
    if (!transactions) {
      return res.status(404).json(generateNotFoundTransactionsErrorMessage());
    }
    return res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateInternalServerErrorMessage());
  }
};
