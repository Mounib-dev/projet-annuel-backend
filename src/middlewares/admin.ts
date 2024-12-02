import { Request, Response, NextFunction } from "express";

import { generateNoPermissionsErrorMessage } from "../helpers/generateErrorResponse";

const adminAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.body.user;
    if (role !== "admin") {
      throw new Error("No permission.");
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json(generateNoPermissionsErrorMessage());
    return;
  }
};

export default adminAuthorization;
