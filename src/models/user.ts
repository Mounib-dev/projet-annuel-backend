import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document<Types.ObjectId> {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

const userSchema: Schema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
});

export const User = mongoose.model<IUser>("Users", userSchema);
