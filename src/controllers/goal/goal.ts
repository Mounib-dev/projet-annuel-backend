import { Request, Response } from "express";
import { Goal } from "../../models/Goal";
import { isValidObjectId } from "mongoose";

// Create Goal
export const createGoal = async (req: Request, res: Response): Promise<any> => {
  try {
    const { description, targetAmount, targetDate, estimatedIncomeRange } =
      req.body;
    const userId = req.body.user.id;

    const goal = await Goal.create({
      user: userId,
      description,
      targetAmount,
      targetDate,
      estimatedIncomeRange,
    });

    return res.status(201).json(goal);
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la création de l'objectif",
      error: err,
    });
  }
};

// List Goals
export const getUserGoals = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.body.user.id;
    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(goals);
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des objectifs",
      error: err,
    });
  }
};

export const getGoalById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.body.user.id;
    const goal = await Goal.findOne({ _id: req.params.id, user: userId });

    if (!goal) return res.status(404).json({ message: "Objectif non trouvé" });

    return res.json(goal);
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la récupération de l'objectif",
      error: err,
    });
  }
};

export const updateGoal = async (req: Request, res: Response): Promise<any> => {
  console.log(req.body);
  const { description, targetAmount, targetDate } = req.body;
  console.log(req.params.id);
  console.log(description);
  console.log(targetAmount);
  console.log(targetDate);
  try {
    const userId = req.body.user.id;
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        $set: {
          description,
          targetAmount,
          targetDate,
        },
      },
      { new: true }
    );

    if (!goal) return res.status(404).json({ message: "Objectif non trouvé" });
    console.log(goal);
    return res.status(200).json(goal);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour", error: err });
  }
};

export const deleteGoal = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.body.user.id;
    console.log(req.params.id);
    console.log("Delete:", userId);
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });
    console.log("???");
    if (!goal) return res.status(404).json({ message: "Objectif non trouvé" });

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};
