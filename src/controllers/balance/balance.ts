import { RequestHandler } from "express";
import { Balance } from "../../models/Balance";
import { generateInternalServerErrorMessage } from "../../helpers/generateErrorResponse";

export const createBalance: RequestHandler = async (
  req,
  res,
  next
): Promise<any> => {
  const user = req.body.user;
  const { amount } = req.body;
  try {
    const balance = new Balance({
      amount,
      user: user.id,
    });
    await balance.save();
    return res.status(201).json({
      message: `New balance created : ${balance}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateInternalServerErrorMessage());
  }
};
