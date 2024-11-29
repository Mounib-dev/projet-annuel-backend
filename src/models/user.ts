import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document<Types.ObjectId> {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
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
});

export const User = mongoose.model<IUser>("Users", userSchema);
