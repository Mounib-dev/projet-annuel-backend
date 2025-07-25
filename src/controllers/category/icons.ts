import { Request, Response } from "express";
import { availableIcons } from "../../data/icons";

export const getAvailableIcons = (_req: Request, res: Response) => {
  res.json(availableIcons);
};