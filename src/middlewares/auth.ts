import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { generateUnauthorizedErrorMessage } from "../helpers/generateErrorResponse";

const SECRET = process.env.JWT_SECRET_KEY as string;

const authorize = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization!.split(" ")[1];
    const decode = jwt.verify(token, SECRET);
    req.body.user = decode;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json(generateUnauthorizedErrorMessage());
    return;
  }
};

export default authorize;
