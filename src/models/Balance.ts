import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBalance extends Document<Types.ObjectId> {
  user: Types.ObjectId;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const balanceSchema: Schema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Balance = mongoose.model<IBalance>("Balance", balanceSchema);
