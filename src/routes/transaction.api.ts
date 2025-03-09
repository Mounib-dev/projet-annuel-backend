import { Router } from "express";
import {
  createTransaction,
  retrieveTransactions,
} from "../controllers/transaction/transaction";
import authorize from "../middlewares/auth";

const router = Router();

router.post("/create", authorize, createTransaction);

router.get("/list", authorize, retrieveTransactions);

export default router;
