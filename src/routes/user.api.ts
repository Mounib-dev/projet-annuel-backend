import { Router } from "express";

import { registerUser, userInfo } from "../controllers/user";

import authorize from "../middlewares/auth";

const router = Router();

router.post("/register", registerUser);

router.get("/user-info", authorize, userInfo);

export default router;
