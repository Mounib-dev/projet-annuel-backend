import { Router } from "express";
import {
  createTransaction,
  retrieveTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction/transaction";
import authorize from "../middlewares/auth";

const router = Router();

router.post("/create", authorize, createTransaction);

router.get("/list", authorize, retrieveTransactions);

router.patch("/transactions/:id", updateTransaction);

router.delete("/transactions/:id", deleteTransaction);

export default router;
