import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";

import cors from "cors";

import mongoose from "mongoose";

import router from "./routes/index.api";
import userRoutes from "./routes/user.api";
import authRoutes from "./routes/auth.api";

import transactionRoutes from "./routes/transaction.api";
import chatbotRoutes from "./routes/chatbot.api";
import balanceRoutes from "./routes/balance.api";

const app: Express = express();

app.use(cors());
app.use(express.json());

let port = process.env.SERVER_PORT || 3000;

app.use("/api/v1", router);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/transaction", transactionRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/v1/balance", balanceRoutes);

const server = app.listen(port, async () => {
  console.log(`[server]:🗄️  Server is running at http://localhost:${port}`);
  // Connect To The Database
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("🛢️  Connected To Database");
  } catch (error: any) {
    console.error(error);
    console.log("⚠️ Error to connect Database");
  }
});

export { app, server };
