import { Types } from "mongoose";
import { Goal } from "../../models/Goal";
import { Transaction } from "../../models/Transaction";

export const updateRecommendationReady = async (userId: Types.ObjectId) => {
  const goals = await Goal.find({ user: userId });

  if (!goals.length) return; // Pas d'objectif à mettre à jour

  const transactions = await Transaction.find({ user: userId });

  const incomeCount = transactions.filter((t) => t.type === "income").length;
  const expenseCount = transactions.filter((t) => t.type === "expense").length;

  const dates = transactions.map((t) => t.date.toDateString());
  const uniqueDays = new Set(dates);

  const first = new Date(
    Math.min(...transactions.map((t) => t.date.getTime()))
  );
  const last = new Date(Math.max(...transactions.map((t) => t.date.getTime())));
  const duration = (last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24); // jours

  const isReady =
    transactions.length >= 30 &&
    incomeCount >= 5 &&
    expenseCount >= 10 &&
    uniqueDays.size >= 20 &&
    duration >= 60;

  for (const goal of goals) {
    await Goal.findByIdAndUpdate(goal._id, { recommendationReady: isReady });
  }
};
