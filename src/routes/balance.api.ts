import { Router } from "express";
import authorize from "../middlewares/auth";
import { createBalance } from "../controllers/balance/balance";

const router = Router();

router.get("/");

router.post("/create", authorize, createBalance);

export default router;
