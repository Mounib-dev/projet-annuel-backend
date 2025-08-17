import { Request, Response } from "express";

export const apiPortal = async (req: Request, res: Response): Promise<any> => {
  return res.status(200).send("Welcome to the API V1 Portal");
};
