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

router.patch("/:id", authorize, updateTransaction);

router.delete("/:id", authorize, deleteTransaction);

export default router;
