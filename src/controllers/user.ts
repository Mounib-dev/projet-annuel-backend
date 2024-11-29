import { Request, Response } from "express";
import { User } from "../models/user";
import {
  generateInternalServerErrorMessage,
  generateUnmatchedPasswordsErrorMessage,
  generateUsedEmailErrorMessage,
} from "../helpers/generateErrorResponse";

import bcrypt from "bcrypt";

const saltRounds = 12;

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
    });
    try {
      const createdUser = await newUser.save();
      if (createdUser) {
        return res.status(201).json({
          message: "User created successfully",
        });
      }
      return res.status(500).json(generateInternalServerErrorMessage());
    } catch (err: any) {
      console.error(err);
      if (err.code === 11000) {
        return res.status(409).json(generateUsedEmailErrorMessage());
      }
      return res.status(500).json(generateInternalServerErrorMessage());
    }
  }
  return res.status(400).json(generateUnmatchedPasswordsErrorMessage());
};
