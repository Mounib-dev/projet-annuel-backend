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
  console.log(amount);
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

export const retrieeBalance: RequestHandler = async (
  req,
  res,
  next
): Promise<any> => {
  const user = req.body.user;
  try {
    const balance = await Balance.find({
      user: user.id,
    });
    console.log(balance[0]);
    if (balance) {
      return res.status(200).json(balance[0]);
    }
    return res.status(404).json({
      message: "Balance not found.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateInternalServerErrorMessage());
  }
};
