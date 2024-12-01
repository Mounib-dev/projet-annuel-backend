import { Request, Response } from "express";
import { User } from "../models/user";
import {
  generateInternalServerErrorMessage,
  generateUnmatchedPasswordsErrorMessage,
  generateUsedEmailErrorMessage,
  generateUnauthorizedErrorMessage,
  generateNotFoundUsersErrorMessage,
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

export const userInfo = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.body.user;
  try {
    const user = await User.findOne({ _id: id }, { password: 0 });
    console.log(user);
    if (!user) {
      return res.status(401).json(generateUnauthorizedErrorMessage());
    }
    return res.status(200).json({
      user,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json(generateInternalServerErrorMessage());
  }
};

export const retrieveUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await User.find({}, { password: 0 });
    if (!users) {
      return res.status(404).json(generateNotFoundUsersErrorMessage());
    }
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json(generateInternalServerErrorMessage());
  }
};
