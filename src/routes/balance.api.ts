import { Router } from "express";
import authorize from "../middlewares/auth";
import { createBalance, retrieeBalance } from "../controllers/balance/balance";

const router = Router();

router.get("/", authorize, retrieeBalance);

router.post("/create", authorize, createBalance);

export default router;
