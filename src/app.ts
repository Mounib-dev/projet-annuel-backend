import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";

import { securityConfig, authLimiter } from "./config/security";

import mongoose from "mongoose";

import router from "./routes/index.api";
import userRoutes from "./routes/user.api";
import authRoutes from "./routes/auth.api";

import transactionRoutes from "./routes/transaction.api";
import chatbotRoutes from "./routes/chatbot.api";
import balanceRoutes from "./routes/balance.api";
import goalRoutes from "./routes/goal.api";
import categoryRoutes from "./routes/category.api";

const app: Express = express();

app.use(express.json());

let port = process.env.PORT || 3000;

securityConfig(app);

app.use("/api/v1", router);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authLimiter, authRoutes);

app.use("/api/v1/transaction", transactionRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/v1/balance", balanceRoutes);
app.use("/api/v1/goal", goalRoutes);
app.use("/api/v1/category", categoryRoutes);

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
