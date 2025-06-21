import mongoose, { Document, Schema, Types } from "mongoose";

export interface IGoal extends Document<Types.ObjectId> {
  user: Types.ObjectId;
  description: string;
  targetAmount: number;
  targetDate: Date;
  estimatedIncomeRange: {
    min: number;
    max: number;
  };
  recommendation?: string;
  recommendationReady: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema: Schema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => value > 0,
        message: "Le montant cible doit être supérieur à zéro.",
      },
    },
    targetDate: {
      type: Date,
      required: true,
    },
    estimatedIncomeRange: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    recommendation: {
      type: String,
      default: "",
    },
    recommendationReady: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Goal = mongoose.model<IGoal>("Goal", goalSchema);
