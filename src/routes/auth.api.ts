import { Router } from "express";

import { login } from "../controllers/auth/user.auth";

const router = Router();

router.post("/login", login);

export default router;
