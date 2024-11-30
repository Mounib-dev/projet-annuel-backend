import { Request, Response } from "express";
import { User } from "../../models/user";
import {
  generateUnahorizedErrorMessage,
  generateInternalServerErrorMessage,
} from "../../helpers/generateErrorResponse";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET_KEY as string;

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(generateUnahorizedErrorMessage());
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(401).json(generateUnahorizedErrorMessage());
    }

    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, SECRET, {
      expiresIn: 60 * 60,
    });
    return res.status(201).json({ accessToken: token });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json(generateInternalServerErrorMessage());
  }
};
