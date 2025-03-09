import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITransaction extends Document<Types.ObjectId> {
  user: Types.ObjectId;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema: Schema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          return value > 0;
        },
        message: "Le montant doit être un nombre positif.",
      },
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
