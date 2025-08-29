/* eslint-disable no-console */
import { RequestHandler } from "express";
import { Types } from "mongoose";

import { Transaction } from "../../models/Transaction";
import {
  generateInternalServerErrorMessage,
  generateNotFoundBalanceErrorMessage,
  generateNotFoundTransactionsErrorMessage,
} from "../../helpers/generateErrorResponse";
import { Balance } from "../../models/Balance";

import { updateRecommendationReady } from "../../services/goal/updateRecommandationReady";

async function applyBalanceDelta(userId: string, delta: number) {
  const balance = await Balance.findOne({ user: userId });
  if (!balance) throw new Error("BALANCE_NOT_FOUND");
  balance.amount += delta;
  await balance.save();
}

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

export const updateTransaction: RequestHandler = async (
  req,
  res
): Promise<any> => {
  const userId = req.body.user.id;
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json(generateNotFoundTransactionsErrorMessage());
  }

  try {
    const tx = await Transaction.findOne({ _id: id, user: userId });
    if (!tx) {
      return res.status(404).json(generateNotFoundTransactionsErrorMessage());
    }

    const oldType = tx.type as "expense" | "income";
    const oldAmount = Number(tx.amount);

    const { transactionType, category, amount, description, date } = req.body;

    if (transactionType) tx.type = transactionType;
    if (category) tx.category = category;
    if (typeof amount !== "undefined") tx.amount = amount;
    if (typeof description !== "undefined") tx.description = description;
    if (date) tx.date = date;

    const newType = tx.type as "expense" | "income";
    const newAmount = Number(tx.amount);

    let delta = 0;

    if (oldType === newType) {
      if (oldType === "expense") {
        delta = oldAmount - newAmount;
      } else {
        delta = newAmount - oldAmount;
      }
    } else {
      delta += oldType === "expense" ? oldAmount : -oldAmount;
      delta += newType === "expense" ? -newAmount : newAmount;
    }

    try {
      await applyBalanceDelta(userId, delta);
    } catch (e: any) {
      if (e.message === "BALANCE_NOT_FOUND") {
        return res.status(404).json(generateNotFoundBalanceErrorMessage());
      }
      throw e;
    }

    await tx.save();

    return res
      .status(200)
      .json({ message: "Transaction updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateInternalServerErrorMessage());
  }
};

export const deleteTransaction: RequestHandler = async (
  req,
  res
): Promise<any> => {
  const userId = req.body.user.id;
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json(generateNotFoundTransactionsErrorMessage());
  }

  try {
    const tx = await Transaction.findOne({ _id: id, user: userId });
    if (!tx) {
      return res.status(404).json(generateNotFoundTransactionsErrorMessage());
    }

    const type = tx.type as "expense" | "income";
    const amt = Number(tx.amount);

    const delta = type === "expense" ? amt : -amt;

    try {
      await applyBalanceDelta(userId, delta);
    } catch (e: any) {
      if (e.message === "BALANCE_NOT_FOUND") {
        return res.status(404).json(generateNotFoundBalanceErrorMessage());
      }
      throw e;
    }

    await tx.deleteOne();

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateInternalServerErrorMessage());
  }
};
