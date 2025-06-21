import { Request, Response } from "express";
import { Goal } from "../../models/Goal";
import { generateRecommandation } from "../../services/goal/generateRecommandation";
import { generateInternalServerErrorMessage } from "../../helpers/generateErrorResponse";

export const generateFinancialRecommandation = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { description, targetAmount, targetDate } = req.body;
  console.log(req.body);
  const recommendation = await generateRecommandation({
    description,
    targetAmount,
    targetDate,
  });

  if (!recommendation)
    return res.status(500).json(generateInternalServerErrorMessage());
  console.log(recommendation);
  try {
    const userId = req.body.user.id;
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        $set: {
          recommendation,
        },
      },
      { new: true }
    );

    if (!goal) return res.status(404).json({ message: "Objectif non trouvé" });

    console.log(goal);
    return res.status(200).json(goal);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Désolé la recommandation n'a pas pu être générée.",
    });
  }
};
