import { Router } from "express";

import { apiPortal } from "../controllers/index";

const router = Router();

router.get("/", apiPortal);

export default router;
