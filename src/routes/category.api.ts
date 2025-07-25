import { Router } from "express";
import { createCategory, getCategories } from "../controllers/category/category";
import authorize from "../middlewares/auth";
import { getAvailableIcons } from "../controllers/category/icons";

const router = Router();

router.post("/create", authorize, createCategory);
router.get("/", getCategories);
router.get("/icons", getAvailableIcons);

export default router;
