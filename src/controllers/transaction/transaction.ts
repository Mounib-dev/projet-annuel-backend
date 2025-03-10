import { RequestHandler } from "express";
import { ITransaction, Transaction } from "../../models/Transaction";
import {
  generateInternalServerErrorMessage,
  generateNotFoundTransactionsErrorMessage,
} from "../../helpers/generateErrorResponse";

export const createTransaction: RequestHandler = async (
  req,
  res,
  next
): Promise<any> => {
  const { transactionType, category, amount, description, date, user } =
    req.body;
  console.log(req.body);
  console.log(user.id);
  const transaction = new Transaction({
    type: transactionType,
    category,
    amount,
    description,
    date,
    user: user.id,
  });
  try {
    const createdTransaciton = await transaction.save();
    if (createdTransaciton) {
      return res.status(201).json({
        message: "Transaction created successfully",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateInternalServerErrorMessage());
  }
};

export const retrieveTransactions: RequestHandler = async (
  req,
  res,
  next
): Promise<any> => {
  const userId = req.body.user.id;
  console.log("*****************");
  console.log(userId);
  try {
    const transactions = await Transaction.find({ user: userId });
    console.log(transactions);
    if (!transactions) {
      return res.status(404).json(generateNotFoundTransactionsErrorMessage());
    }
    return res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateInternalServerErrorMessage());
  }
};
